import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/', authorize(['admin']), userController.getAllUsers.bind(userController));
router.get('/:id', authorize(['admin']), userController.getUserById.bind(userController));
router.delete('/:id', authorize(['admin']), userController.deleteUser.bind(userController));
router.put('/:id/status', authorize(['admin']), userController.updateUserStatus.bind(userController));

export default router;