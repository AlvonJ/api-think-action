import { Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError.js';
import { getCurrentHistoryAccountInteractor } from '../../../domain/interactor/users/getCurrentHistoryAccountInteractor.js';
import { getCurrentHistoryAccountPersistence } from '../../../infrastructure/database/mongodb/users/getCurrentHistoryAccountPersistence.js';

export async function getCurrentHistoryAccount(req, res: Response, next: NextFunction): Promise<void> {
  try {
    const authUserId = req.user._id;

    const data = await getCurrentHistoryAccountInteractor(getCurrentHistoryAccountPersistence, authUserId);

    res.status(200).json({
      status: 'success',
      results: data.length,
      data,
    });
  } catch (err) {
    if (err.cause === 'DataNotFound') return next(new AppError(err.message, 404));
    if (err.cause === 'ValidationError' || err.cause === 'DuplicateError') return next(new AppError(err.message, 400));

    next(err);
  }
}
