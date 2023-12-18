import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { getUserPersistence } from '../../../infrastructure/database/mongodb/users/getUserPersistence.js';
import { AppError } from '../../utils/AppError.js';
import { getUserInteractor } from '../../../domain/interactor/users/getUserInteractor.js';

function verifyJwt(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

export async function protect(req, res: Response, next: NextFunction) {
  try {
    // 1) Getting token and check if it's there
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) return next(new AppError('You are not logged in! Please log in to get access.', 401));

    // 2) Verification token
    const decoded: any = await verifyJwt(token);

    // 3) Check if user still exists
    const currentUser = await getUserInteractor(getUserPersistence, decoded.id);

    if (!currentUser) return next(new AppError('The user belonging to this token does no longer exist.', 401));

    // Grant access to protected route
    req.user = currentUser;
    res.locals.user = currentUser;

    next();
  } catch (err) {
    next(err);
  }
}
