import { Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError.js';

import { getCurrentUserRequestInteractor } from '../../../domain/interactor/users/getCurrentUserRequestInteractor.js';
import { getCurrentUserRequestPersistence } from '../../../infrastructure/database/mongodb/users/getCurrentUserRequestPersistence.js';

export async function getCurrentUserRequest(req, res: Response, next: NextFunction): Promise<void> {
  try {
    const authUserId = req.user._id;

    const { limit = 10, page = 1 } = req.query;

    const data = await getCurrentUserRequestInteractor(getCurrentUserRequestPersistence, {
      authUserId,
      limit,
      page,
    });

    res.status(200).json({
      status: 'success',
      limit: +limit,
      page: +page,
      results: data.length,
      data,
    });
  } catch (err) {
    if (err.cause === 'DataNotFound') return next(new AppError(err.message, 404));
    if (err.cause === 'ValidationError' || err.cause === 'DuplicateError') return next(new AppError(err.message, 400));

    next(err);
  }
}
