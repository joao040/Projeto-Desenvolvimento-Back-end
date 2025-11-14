import { Response } from 'express';
import { validationResult } from 'express-validator';
import { Patient } from '../models/Patient';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/auth';
import logger from '../utils/logger';

/**
 * @swagger
 * /api/patients:
 *   get:
 *     tags: [Patients]
 *     summary: Listar pacientes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Itens por página
 *     responses:
 *       200:
 *         description: Lista de pacientes
 */
export const getPatients = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { rows: patients, count: total } = await Patient.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email', 'phone'],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: patients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('Error fetching patients:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pacientes',
    });
  }
};

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     tags: [Patients]
 *     summary: Buscar paciente por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do paciente
 *       404:
 *         description: Paciente não encontrado
 */
export const getPatientById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email', 'phone', 'cpf'],
        },
      ],
    });

    if (!patient) {
      res.status(404).json({
        success: false,
        message: 'Paciente não encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error: any) {
    logger.error('Error fetching patient:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar paciente',
    });
  }
};

/**
 * @swagger
 * /api/patients:
 *   post:
 *     tags: [Patients]
 *     summary: Cadastrar novo paciente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Paciente criado com sucesso
 */
export const createPatient = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const { userId, dateOfBirth, gender, bloodType, address, emergencyContact, ...rest } =
      req.body;

    // Verifica se o userId existe
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuário não encontrado',
      });
      return;
    }

    // Verifica se já existe um paciente para este userId
    const existingPatient = await Patient.findOne({ where: { userId } });
    if (existingPatient) {
      res.status(400).json({
        success: false,
        message: 'Já existe um perfil de paciente para este usuário',
      });
      return;
    }

    // Cria o paciente
    const patient = await Patient.create({
      userId,
      dateOfBirth,
      gender,
      bloodType,
      address,
      emergencyContact,
      consentDate: new Date(),
      ...rest,
    });

    await patient.reload({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email', 'phone'],
        },
      ],
    });

    logger.info('Patient created', { patientId: patient.id, userId });

    res.status(201).json({
      success: true,
      message: 'Paciente cadastrado com sucesso',
      data: patient,
    });
  } catch (error: any) {
    logger.error('Error creating patient:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cadastrar paciente',
    });
  }
};

/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     tags: [Patients]
 *     summary: Atualizar paciente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paciente atualizado
 */
export const updatePatient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findByPk(req.params.id);

    if (!patient) {
      res.status(404).json({
        success: false,
        message: 'Paciente não encontrado',
      });
      return;
    }

    await patient.update(req.body);
    await patient.reload({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email', 'phone'],
        },
      ],
    });

    logger.info('Patient updated', { patientId: patient.id });

    res.status(200).json({
      success: true,
      message: 'Paciente atualizado com sucesso',
      data: patient,
    });
  } catch (error: any) {
    logger.error('Error updating patient:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar paciente',
    });
  }
};

/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     tags: [Patients]
 *     summary: Remover paciente (LGPD - Direito ao esquecimento)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paciente removido
 */
export const deletePatient = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patient = await Patient.findByPk(req.params.id);

    if (!patient) {
      res.status(404).json({
        success: false,
        message: 'Paciente não encontrado',
      });
      return;
    }

    const userId = patient.userId;

    // Remove o paciente
    await patient.destroy();

    // Remove também o usuário relacionado (direito ao esquecimento - LGPD)
    await User.destroy({ where: { id: userId } });

    logger.info('Patient deleted (LGPD)', { patientId: patient.id, userId });

    res.status(200).json({
      success: true,
      message: 'Paciente removido com sucesso',
    });
  } catch (error: any) {
    logger.error('Error deleting patient:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover paciente',
    });
  }
};
