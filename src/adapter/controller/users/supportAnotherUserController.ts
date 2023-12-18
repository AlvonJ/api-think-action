import { Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError.js';
import { supportAnotherUserInteractor } from '../../../domain/interactor/users/supportAnotherUserInteractor.js';
import { supportAnotherUserPersistence } from '../../../infrastructure/database/mongodb/users/supportAnotherUserPersistence.js';

export async function supportAnotherUser(req, res: Response, next: NextFunction): Promise<void> {
  try {
    const authUserId = req.user._id;

    const { userId } = req.body;

    const updatedUser = await supportAnotherUserInteractor(supportAnotherUserPersistence, { authUserId, userId });

    res.status(200).json({
      status: 'success',
      message: updatedUser.isPublic ? 'User is now supported' : 'Support request sent successfully',
      data: updatedUser,
    });
  } catch (err) {
    if (err.cause === 'DataNotFound') return next(new AppError(err.message, 404));
    if (err.cause === 'ValidationError' || err.cause === 'DuplicateError') return next(new AppError(err.message, 400));

    next(err);
  }
}
