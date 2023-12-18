import { Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError.js';

import { updateCurrentUserInteractor } from '../../../domain/interactor/users/updateCurrentUserInteractor.js';
import { updateCurrentUserPersistence } from '../../../infrastructure/database/mongodb/users/updateCurrentUserPersistence.js';

export async function updateCurrentUser(req, res: Response, next: NextFunction): Promise<void> {
  try {
    const authUserId = req.user._id;

    const { fullname, username, bio, photo, isPublic } = req.body;

    const updatedUser = await updateCurrentUserInteractor(updateCurrentUserPersistence, {
      authUserId,
      user: { fullname, username, bio, photo, isPublic },
    });

    res.status(200).json({
      status: 'success',
      data: updatedUser,
    });
  } catch (err) {
    if (err.cause === 'DataNotFound') return next(new AppError(err.message, 404));
    if (err.cause === 'ValidationError' || err.cause === 'DuplicateError') return next(new AppError(err.message, 400));

    next(err);
  }
}
