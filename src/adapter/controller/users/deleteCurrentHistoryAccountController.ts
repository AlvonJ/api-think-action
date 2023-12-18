import { Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError.js';

import { deleteCurrentHistoryAccountInteractor } from '../../../domain/interactor/users/deleteCurrentHistoryAccountInteractor.js';
import { deleteCurrentHistoryAccountPersistence } from '../../../infrastructure/database/mongodb/users/deleteCurrentHistoryAccountPersistence.js';

export async function deleteCurrentHistory(req, res: Response, next: NextFunction): Promise<void> {
  try {
    const authUserId = req.user._id;

    await deleteCurrentHistoryAccountInteractor(deleteCurrentHistoryAccountPersistence, authUserId);

    res.status(204).json({});
  } catch (err) {
    if (err.cause === 'DataNotFound') return next(new AppError(err.message, 404));
    if (err.cause === 'ValidationError' || err.cause === 'DuplicateError') return next(new AppError(err.message, 400));

    next(err);
  }
}
