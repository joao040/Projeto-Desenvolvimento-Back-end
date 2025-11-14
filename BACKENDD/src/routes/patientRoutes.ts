import express from 'express';
import * as patientController from '../controllers/patientController';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../types';
import {
  createPatientValidator,
  idValidator,
  paginationValidator,
} from '../middlewares/validators';
import { auditLog } from '../middlewares/audit';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

router.get(
  '/',
  authorize(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.RECEPTIONIST),
  paginationValidator,
  auditLog('READ', 'patients'),
  patientController.getPatients
);

router.get(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.PATIENT),
  idValidator,
  auditLog('READ', 'patients'),
  patientController.getPatientById
);

router.post(
  '/',
  authorize(UserRole.ADMIN, UserRole.RECEPTIONIST),
  createPatientValidator,
  auditLog('CREATE', 'patients'),
  patientController.createPatient
);

router.put(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.PATIENT),
  idValidator,
  auditLog('UPDATE', 'patients'),
  patientController.updatePatient
);

router.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  idValidator,
  auditLog('DELETE', 'patients'),
  patientController.deletePatient
);

export default router;
