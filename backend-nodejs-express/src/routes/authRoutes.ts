import express from 'express';
import { register, login, profile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, profile); ///the enxt functionin middleware call profile

export default router;
