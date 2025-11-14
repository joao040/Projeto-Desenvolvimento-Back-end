import { Response } from 'express';
import { validationResult } from 'express-validator';
import { Appointment } from '../models/Appointment';
import { Patient } from '../models/Patient';
import { Professional } from '../models/Professional';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/auth';
import { AppointmentStatus } from '../types';
import logger from '../utils/logger';

export const getAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const where: any = {};

    // Filtros opcionais
    if (req.query.patientId) where.patientId = req.query.patientId;
    if (req.query.professionalId) where.professionalId = req.query.professionalId;
    if (req.query.status) where.status = req.query.status;
    if (req.query.date) {
      const date = new Date(req.query.date as string);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      where.scheduledDate = {
        [require('sequelize').Op.between]: [startOfDay, endOfDay],
      };
    }

    const { rows: appointments, count: total } = await Appointment.findAndCountAll({
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
          attributes: ['userId', 'specialization'],
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
      order: [['scheduledDate', 'ASC']],
    });

    res.status(200).json({
      success: true,
      data: appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    logger.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar agendamentos',
    });
  }
};

export const getAppointmentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email', 'phone'],
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

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error: any) {
    logger.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar agendamento',
    });
  }
};

export const createAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const { patientId, professionalId, scheduledDate, ...rest } = req.body;

    // Verifica se o paciente existe
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      res.status(404).json({
        success: false,
        message: 'Paciente não encontrado',
      });
      return;
    }

    // Verifica se o profissional existe
    const professional = await Professional.findByPk(professionalId);
    if (!professional) {
      res.status(404).json({
        success: false,
        message: 'Profissional não encontrado',
      });
      return;
    }

    // Verifica conflito de horário
    const { Op } = require('sequelize');
    const conflictingAppointment = await Appointment.findOne({
      where: {
        professionalId,
        scheduledDate: new Date(scheduledDate),
        status: { [Op.notIn]: [AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED] },
      },
    });

    if (conflictingAppointment) {
      res.status(400).json({
        success: false,
        message: 'Horário já ocupado para este profissional',
      });
      return;
    }

    const appointment = await Appointment.create({
      patientId,
      professionalId,
      scheduledDate,
      ...rest,
    });

    await appointment.reload({
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

    logger.info('Appointment created', { appointmentId: appointment.id });

    res.status(201).json({
      success: true,
      message: 'Agendamento criado com sucesso',
      data: appointment,
    });
  } catch (error: any) {
    logger.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar agendamento',
    });
  }
};

export const updateAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado',
      });
      return;
    }

    await appointment.update(req.body);
    await appointment.reload({
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

    logger.info('Appointment updated', { appointmentId: appointment.id });

    res.status(200).json({
      success: true,
      message: 'Agendamento atualizado com sucesso',
      data: appointment,
    });
  } catch (error: any) {
    logger.error('Error updating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar agendamento',
    });
  }
};

export const cancelAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { cancelReason } = req.body;

    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado',
      });
      return;
    }

    await appointment.update({
      status: AppointmentStatus.CANCELLED,
      cancelReason,
      cancelledBy: req.user?.id,
      cancelledAt: new Date(),
    });

    logger.info('Appointment cancelled', {
      appointmentId: appointment.id,
      cancelledBy: req.user?.id,
    });

    res.status(200).json({
      success: true,
      message: 'Agendamento cancelado com sucesso',
      data: appointment,
    });
  } catch (error: any) {
    logger.error('Error cancelling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar agendamento',
    });
  }
};
