import express from 'express';
import * as appointmentController from '../controllers/appointmentController';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../types';
import {
  createAppointmentValidator,
  idValidator,
  paginationValidator,
} from '../middlewares/validators';
import { auditLog } from '../middlewares/audit';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

router.get(
  '/',
  paginationValidator,
  auditLog('READ', 'appointments'),
  appointmentController.getAppointments
);

router.get(
  '/:id',
  idValidator,
  auditLog('READ', 'appointments'),
  appointmentController.getAppointmentById
);

router.post(
  '/',
  authorize(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.PATIENT),
  createAppointmentValidator,
  auditLog('CREATE', 'appointments'),
  appointmentController.createAppointment
);

router.put(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.RECEPTIONIST),
  idValidator,
  auditLog('UPDATE', 'appointments'),
  appointmentController.updateAppointment
);

router.patch(
  '/:id/cancel',
  idValidator,
  auditLog('UPDATE', 'appointments'),
  appointmentController.cancelAppointment
);

export default router;
