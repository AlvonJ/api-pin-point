import express from 'express';

import groupController from '../controller/groups/index.js';
import authController from '../controller/auth/index.js';

export const groupRouter = express.Router();

// PROTECT ALL ROUTES BELOW
groupRouter.use(authController.protect);

// Get All Groups that invited current user ID
groupRouter.get('/invitations/getMe', groupController.getGroupsByInvitationUserId);
// Update group
groupRouter.patch('/:id', groupController.updateGroup);

// ADMIN ONLY
groupRouter.use(authController.restrictTo('admin'));

// Create group
groupRouter.post('/', groupController.createGroup);

// Get All groups
groupRouter.get('/', groupController.getAllGroups);

// Get One group
groupRouter.get('/:id', groupController.getGroup);

// Delete group
groupRouter.delete('/:id', groupController.deleteGroup);
