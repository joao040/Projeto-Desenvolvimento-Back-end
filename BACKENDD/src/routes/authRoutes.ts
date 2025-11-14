import express from 'express';
import * as authController from '../controllers/authController';
import { loginValidator, registerValidator } from '../middlewares/validators';
import { authenticate } from '../middlewares/auth';
import { auditLog } from '../middlewares/audit';

const router = express.Router();

/**
 * Rotas públicas (sem autenticação)
 */
router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);
router.post('/refresh', authController.refresh);

/**
 * Rotas protegidas (com autenticação)
 */
router.post('/logout', authenticate, auditLog('LOGOUT', 'auth'), authController.logout);

export default router;
