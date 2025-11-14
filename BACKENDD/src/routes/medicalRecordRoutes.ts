import express from 'express';
import * as medicalRecordController from '../controllers/medicalRecordController';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../types';
import { idValidator, paginationValidator } from '../middlewares/validators';
import { auditLog } from '../middlewares/audit';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

router.get(
  '/',
  authorize(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE),
  paginationValidator,
  auditLog('READ', 'medical-records'),
  medicalRecordController.getMedicalRecords
);

router.get(
  '/patient/:patientId',
  authorize(UserRole.ADMIN, UserRole.DOCTOR, UserRole.NURSE, UserRole.PATIENT),
  idValidator,
  auditLog('READ', 'medical-records'),
  medicalRecordController.getPatientMedicalHistory
);

router.post(
  '/',
  authorize(UserRole.ADMIN, UserRole.DOCTOR),
  auditLog('CREATE', 'medical-records'),
  medicalRecordController.createMedicalRecord
);

router.put(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.DOCTOR),
  idValidator,
  auditLog('UPDATE', 'medical-records'),
  medicalRecordController.updateMedicalRecord
);

export default router;
