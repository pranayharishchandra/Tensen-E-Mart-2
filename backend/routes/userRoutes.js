import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.route('/').post(registerUser).get(protect, admin, getUsers);
userRouter.post('/auth', authUser);
userRouter.post('/logout', logoutUser);

userRouter
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
  
userRouter
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default userRouter;
