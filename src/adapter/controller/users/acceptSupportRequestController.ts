import { Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError.js';
import { acceptSupportRequestInteractor } from '../../../domain/interactor/users/acceptSupportRequestInteractor.js';
import { acceptSupportRequestPersistence } from '../../../infrastructure/database/mongodb/users/acceptSupportRequestPersistence.js';

export async function acceptSupportRequest(req, res: Response, next: NextFunction): Promise<void> {
  try {
    const authUserId = req.user._id;

    const { userId } = req.body;

    const updatedUser = await acceptSupportRequestInteractor(acceptSupportRequestPersistence, { authUserId, userId });

    res.status(200).json({
      status: 'success',
      message: 'Support request accepted successfully',
      data: updatedUser,
    });
  } catch (err) {
    if (err.cause === 'DataNotFound') return next(new AppError(err.message, 404));
    if (err.cause === 'ValidationError' || err.cause === 'DuplicateError') return next(new AppError(err.message, 400));

    next(err);
  }
}
