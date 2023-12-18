import { Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError.js';
import { getAllSupportingInteractor } from '../../../domain/interactor/users/getAllSupportingInteractor.js';
import { getAllSupportingPersistence } from '../../../infrastructure/database/mongodb/users/getAllSupportingPersistence.js';

export async function getAllSupporting(req, res: Response, next: NextFunction): Promise<void> {
  try {
    const authUserId = req.user._id;

    const { id } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const user = await getAllSupportingInteractor(getAllSupportingPersistence, { authUserId, userId: id, limit, page });

    res.status(200).json({
      status: 'success',
      limit: +limit,
      page: +page,
      results: user.length,
      data: user,
    });
  } catch (err) {
    if (err.cause === 'DataNotFound') return next(new AppError(err.message, 404));
    if (err.cause === 'ValidationError' || err.cause === 'DuplicateError') return next(new AppError(err.message, 400));

    next(err);
  }
}
