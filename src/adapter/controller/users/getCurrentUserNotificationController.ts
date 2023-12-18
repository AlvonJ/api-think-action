import { Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError.js';

import { getCurrentUserNotificationInteractor } from '../../../domain/interactor/users/getCurrentUserNotificationInteractor.js';
import { getCurrentUserNotificationPersistence } from '../../../infrastructure/database/mongodb/users/getCurrentUserNotificationPersistence.js';

export async function getCurrentUserNotification(req, res: Response, next: NextFunction): Promise<void> {
  try {
    const authUserId = req.user._id;

    const data = await getCurrentUserNotificationInteractor(getCurrentUserNotificationPersistence, authUserId);

    let totalLength = 0;

    for (let key in data) {
      if (Array.isArray(data[key])) {
        totalLength += data[key].length;
      }
    }
    res.status(200).json({
      status: 'success',
      limit: 20,
      results: totalLength,
      data,
    });
  } catch (err) {
    if (err.cause === 'DataNotFound') return next(new AppError(err.message, 404));
    if (err.cause === 'ValidationError' || err.cause === 'DuplicateError') return next(new AppError(err.message, 400));

    next(err);
  }
}
