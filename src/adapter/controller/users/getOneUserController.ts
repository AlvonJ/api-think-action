import { Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError.js';
import { getOneUserInteractor } from '../../../domain/interactor/users/getOneUserInteractor.js';
import { getOneUserPersistence } from '../../../infrastructure/database/mongodb/users/getOneUserPersistence.js';

// Read One User
export async function getOneUser(req, res: Response, next: NextFunction): Promise<void> {
  try {
    const authUserId = req.user._id;

    const { id } = req.params;

    const user = await getOneUserInteractor(getOneUserPersistence, { authUserId, userId: id });

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    if (err.cause === 'DataNotFound') return next(new AppError(err.message, 404));
    if (err.cause === 'ValidationError' || err.cause === 'DuplicateError') return next(new AppError(err.message, 400));

    next(err);
  }
}
