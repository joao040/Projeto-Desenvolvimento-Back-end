import { Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middlewares/auth';
import logger from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - phone
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, DOCTOR, NURSE, RECEPTIONIST, PATIENT]
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors: errors.array(),
      });
      return;
    }

    const { email, password, firstName, lastName, phone, role, cpf } = req.body;

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Email já cadastrado',
      });
      return;
    }

    // Cria o novo usuário
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      cpf,
      isActive: true,
    });

    // Gera tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
    );

    // Salva refresh token
    user.refreshToken = refreshToken;
    await user.save();

    logger.info('New user registered', { userId: user.id, email: user.email });

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    logger.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar usuário',
    });
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login de usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors: errors.array(),
      });
      return;
    }

    const { email, password } = req.body;

    // Busca usuário
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Credenciais inválidas',
      });
      return;
    }

    // Verifica se está ativo
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Usuário inativo. Entre em contato com o administrador.',
      });
      return;
    }

    // Verifica senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Credenciais inválidas',
      });
      return;
    }

    // Gera tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
    );

    // Atualiza último login e refresh token
    user.lastLogin = new Date();
    user.refreshToken = refreshToken;
    await user.save();

    logger.info('User logged in', { userId: user.id, email: user.email });

    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    logger.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login',
    });
  }
};

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Renovar access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token renovado
 *       401:
 *         description: Token inválido
 */
export const refresh = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: 'Refresh token não fornecido',
      });
      return;
    }

    // Verifica refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string };

    // Busca usuário
    const user = await User.findByPk(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      res.status(401).json({
        success: false,
        message: 'Refresh token inválido',
      });
      return;
    }

    // Gera novo access token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    res.status(200).json({
      success: true,
      data: {
        accessToken,
      },
    });
  } catch (error: any) {
    logger.error('Error refreshing token:', error);
    res.status(401).json({
      success: false,
      message: 'Refresh token inválido ou expirado',
    });
  }
};

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout de usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 */
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Não autenticado',
      });
      return;
    }

    // Remove refresh token
    await User.update({ refreshToken: null }, { where: { id: req.user.id } });

    logger.info('User logged out', { userId: req.user.id });

    res.status(200).json({
      success: true,
      message: 'Logout realizado com sucesso',
    });
  } catch (error: any) {
    logger.error('Error logging out:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer logout',
    });
  }
};
