import express from 'express';

import attendanceController from '../controller/attendances/index.js';
import authController from '../controller/auth/index.js';

export const attendanceRouter = express.Router();

// PROTECT ALL ROUTES BELOW
attendanceRouter.use(authController.protect);

// Create attendance
attendanceRouter.post('/', attendanceController.createAttendance);
// Get Current User attendances
attendanceRouter.get('/getMe', attendanceController.getCurrentUserAttendances);

// ADMIN ONLY
attendanceRouter.use(authController.restrictTo('admin'));

// Get All attendances
attendanceRouter.get('/', attendanceController.getAllAttendances);

// Get One attendance
attendanceRouter.get('/:id', attendanceController.getAttendance);

// Delete attendance
attendanceRouter.delete('/:id', attendanceController.deleteAttendance);
