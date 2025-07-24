import express from 'express';
import { register, login, profile, logout } from '../controllers/userController';
import { protect,requireAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile',  requireAuth,profile); ///the enxt functionin middleware call profile
router.get('/logout', requireAuth,logout)

export default router;
