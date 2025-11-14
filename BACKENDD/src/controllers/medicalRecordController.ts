import { Response } from 'express';
import { validationResult } from 'express-validator';
import { MedicalRecord } from '../models/MedicalRecord';
import { Patient } from '../models/Patient';
import { Professional } from '../models/Professional';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/auth';
import logger from '../utils/logger';

export const getMedicalRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (req.query.patientId) where.patientId = req.query.patientId;

    const { rows: records, count: total } = await MedicalRecord.findAndCountAll({
      where,
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName'],
            },
          ],
        },
        {
          model: Professional,
          as: 'professional',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName'],
            },
          ],
        },
      ],
      limit,
      offset,
      order: [['date', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('Error fetching medical records:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar prontuários',
    });
  }
};

export const getPatientMedicalHistory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      res.status(404).json({
        success: false,
        message: 'Paciente não encontrado',
      });
      return;
    }

    const records = await MedicalRecord.findAll({
      where: { patientId },
      include: [
        {
          model: Professional,
          as: 'professional',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName'],
            },
          ],
        },
      ],
      order: [['date', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error: any) {
    logger.error('Error fetching patient medical history:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar histórico médico',
    });
  }
};

export const createMedicalRecord = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const { patientId, professionalId, diagnosis, symptoms, treatmentPlan, ...rest } = req.body;

    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      res.status(404).json({
        success: false,
        message: 'Paciente não encontrado',
      });
      return;
    }

    const record = await MedicalRecord.create({
      patientId,
      professionalId,
      diagnosis,
      symptoms,
      treatmentPlan,
      ...rest,
    });

    await record.reload({
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName'],
            },
          ],
        },
        {
          model: Professional,
          as: 'professional',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName'],
            },
          ],
        },
      ],
    });

    logger.info('Medical record created', { recordId: record.id, patientId });

    res.status(201).json({
      success: true,
      message: 'Prontuário criado com sucesso',
      data: record,
    });
  } catch (error: any) {
    logger.error('Error creating medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar prontuário',
    });
  }
};

export const updateMedicalRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const record = await MedicalRecord.findByPk(req.params.id);

    if (!record) {
      res.status(404).json({
        success: false,
        message: 'Prontuário não encontrado',
      });
      return;
    }

    await record.update(req.body);
    await record.reload({
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName'],
            },
          ],
        },
        {
          model: Professional,
          as: 'professional',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName'],
            },
          ],
        },
      ],
    });

    logger.info('Medical record updated', { recordId: record.id });

    res.status(200).json({
      success: true,
      message: 'Prontuário atualizado com sucesso',
      data: record,
    });
  } catch (error: any) {
    logger.error('Error updating medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar prontuário',
    });
  }
};
