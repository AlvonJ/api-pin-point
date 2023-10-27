import express from 'express';

import userController from '../controller/users/index.js';
import authController from '../controller/auth/index.js';

export const userRouter = express.Router();

// Authentication
userRouter.post('/login', authController.login);
userRouter.post('/register', authController.register);
userRouter.get('/logout', authController.logout);

// PROTECT ALL ROUTES BELOW
userRouter.use(authController.protect);
// Update current user
userRouter.patch('/updateMe', userController.updateCurrentUser);
// Update current user password
userRouter.patch('/updateMyPassword', authController.updatePassword);

// ADMIN ONLY
userRouter.use(authController.restrictTo('admin'));

// Update User
userRouter.patch('/:id', userController.updateUser);

// Get All Users
userRouter.get('/', userController.getAllUsers);

// Get One User
userRouter.get('/:id', userController.getUser);

// Delete User
userRouter.delete('/:id', userController.deleteUser);
