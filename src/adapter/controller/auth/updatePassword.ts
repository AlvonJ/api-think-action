import bcrypt from 'bcrypt';
import { Response, NextFunction } from 'express';
import { AppError } from '../../utils/AppError.js';
import { getUserPasswordInteractor } from '../../../domain/interactor/users/getUserPasswordInteractor.js';
import { getUserPasswordPersistence } from '../../../infrastructure/database/mongodb/users/getUserPasswordPersistence.js';
import { updateCurrentUserPasswordInteractor } from '../../../domain/interactor/users/updateCurrentUserPasswordInteractor.js';
import { updateCurrentUserPasswordPersistence } from '../../../infrastructure/database/mongodb/users/updateCurrentUserPasswordPersistence.js';
import { createSendToken } from './createSendToken.js';

export async function updatePassword(req, res: Response, next: NextFunction) {
  try {
    const authUserId = req.user._id.toString();
    const { passwordCurrent, passwordNew } = req.body;

    const user = await getUserPasswordInteractor(getUserPasswordPersistence, authUserId);

    // Check if user is exist and compare the password using bcrypt
    if (!user || !(await bcrypt.compare(passwordCurrent, user.password))) {
      return next(new AppError('Your current password is wrong!', 401));
    }

    if (!passwordNew || passwordNew?.length < 6)
      return next(new AppError('Password length must be greater than 5', 400));

    const hashedPassword = await bcrypt.hash(passwordNew, 10);

    user.password = hashedPassword;

    const updatedUser = await updateCurrentUserPasswordInteractor(updateCurrentUserPasswordPersistence, {
      authUserId,
      user,
    });

    createSendToken(updatedUser, 200, req, res);
  } catch (err) {
    next(err);
  }
}
