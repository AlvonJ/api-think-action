import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { getUserByEmailPersistence } from '../../../infrastructure/database/mongodb/users/getUserByEmailPersistence.js';
import { AppError } from '../../utils/AppError.js';
import { createSendToken } from './createSendToken.js';
import { getUserByEmailInteractor } from '../../../domain/interactor/users/getUserByEmailInteractor.js';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmailInteractor(getUserByEmailPersistence, email);

    // Check if user is exist and compare the password using bcrypt
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Incorrect email or password!', 401));
    }

    createSendToken(user, 200, req, res);
  } catch (err) {
    next(err);
  }
}
