import { Request, Response, NextFunction } from 'express';
import { createUserInteractor } from '../../../domain/interactor/users/createUserInteractor.js';
import { createUserPersistence } from '../../../infrastructure/database/mongodb/users/createUserPersistence.js';
import { AppError } from '../../utils/AppError.js';
import { createSendToken } from './createSendToken.js';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password, email } = req.body;

    const newUser = await createUserInteractor(createUserPersistence, {
      password,
      username,
      email,
    });

    createSendToken(newUser, 201, req, res);
  } catch (err) {
    if (err.cause === 'ValidationError' || err.cause === 'DuplicateError') return next(new AppError(err.message, 400));

    next(err);
  }
}
