import express from 'express';

import authController from '../controller/auth/index.js';
import userController from '../controller/users/index.js';

export const userRouter = express.Router();

// Authentication
userRouter.post('/login', authController.login);
userRouter.post('/register', authController.register);
userRouter.get('/logout', authController.logout);

// PROTECT ALL ROUTES BELOW
userRouter.use(authController.protect);

// Update current user password
userRouter.patch('/updateMyPassword', authController.updatePassword);

// Users
userRouter.get('/request', userController.getCurrentUserRequest);
userRouter.get('/notification', userController.getCurrentUserNotification);
userRouter.get('/search', userController.searchUserAccount);
userRouter.get('/history', userController.getCurrentHistoryAccount);
userRouter.post('/support', userController.supportAnotherUser);
userRouter.post('/unsupport', userController.unsupportAnotherUser);
userRouter.post('/request/accept', userController.acceptSupportRequest);
userRouter.post('/request/reject', userController.rejectSupportRequest);
userRouter.patch('/', userController.updateCurrentUser);
userRouter.delete('/history', userController.deleteCurrentHistory);

userRouter.get('/:id', userController.getOneUser);
userRouter.get('/:id/supporter', userController.getAllSupporter);
userRouter.get('/:id/supporting', userController.getAllSupporting);
