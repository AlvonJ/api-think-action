import { Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError.js';
import { rejectSupportRequestInteractor } from '../../../domain/interactor/users/rejectSupportRequestInteractor.js';
import { rejectSupportRequestPersistence } from '../../../infrastructure/database/mongodb/users/rejectSupportRequestPersistence.js';

export async function rejectSupportRequest(req, res: Response, next: NextFunction): Promise<void> {
  try {
    const authUserId = req.user._id;

    const { userId } = req.body;

    const updatedUser = await rejectSupportRequestInteractor(rejectSupportRequestPersistence, { authUserId, userId });

    res.status(200).json({
      status: 'success',
      message: 'Support request rejected successfully',
      data: updatedUser,
    });
  } catch (err) {
    if (err.cause === 'DataNotFound') return next(new AppError(err.message, 404));
    if (err.cause === 'ValidationError' || err.cause === 'DuplicateError') return next(new AppError(err.message, 400));

    next(err);
  }
}
