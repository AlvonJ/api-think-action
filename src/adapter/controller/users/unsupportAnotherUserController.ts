import { Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError.js';
import { unsupportAnotherUserInteractor } from '../../../domain/interactor/users/unsupportAnotherUserInteractor.js';
import { unsupportAnotherUserPersistence } from '../../../infrastructure/database/mongodb/users/unsupportAnotherUserPersistence.js';

export async function unsupportAnotherUser(req, res: Response, next: NextFunction): Promise<void> {
  try {
    const authUserId = req.user._id;

    const { userId } = req.body;

    const updatedUser = await unsupportAnotherUserInteractor(unsupportAnotherUserPersistence, { authUserId, userId });

    res.status(200).json({
      status: 'success',
      message: 'User is now unsupported',
      data: updatedUser,
    });
  } catch (err) {
    if (err.cause === 'DataNotFound') return next(new AppError(err.message, 404));
    if (err.cause === 'ValidationError' || err.cause === 'DuplicateError') return next(new AppError(err.message, 400));

    next(err);
  }
}
