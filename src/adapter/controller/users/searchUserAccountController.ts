import { Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError.js';

import { searchUserAccountInteractor } from '../../../domain/interactor/users/searchUserAccountInteractor.js';
import { searchUserAccountPersistence } from '../../../infrastructure/database/mongodb/users/searchUserAccountPersistence.js';

export async function searchUserAccount(req, res: Response, next: NextFunction): Promise<void> {
  try {
    const authUserId = req.user._id;

    const { username } = req.query;

    const data = await searchUserAccountInteractor(searchUserAccountPersistence, { authUserId, username });

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
