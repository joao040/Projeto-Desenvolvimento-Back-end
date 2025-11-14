import { body, param, query, ValidationChain } from 'express-validator';
import { UserRole, Gender, BloodType, AppointmentType } from '../types';

export const registerValidator: ValidationChain[] = [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('A senha deve ter no mínimo 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('A senha deve conter letras maiúsculas, minúsculas e números'),
  body('firstName').trim().notEmpty().withMessage('Nome é obrigatório'),
  body('lastName').trim().notEmpty().withMessage('Sobrenome é obrigatório'),
  body('phone').trim().notEmpty().withMessage('Telefone é obrigatório'),
  body('role')
    .isIn(Object.values(UserRole))
    .withMessage('Tipo de usuário inválido'),
];

export const loginValidator: ValidationChain[] = [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
];

export const createPatientValidator: ValidationChain[] = [
  body('dateOfBirth').isISO8601().withMessage('Data de nascimento inválida'),
  body('gender').isIn(Object.values(Gender)).withMessage('Gênero inválido'),
  body('bloodType')
    .optional()
    .isIn(Object.values(BloodType))
    .withMessage('Tipo sanguíneo inválido'),
  body('address.street').trim().notEmpty().withMessage('Rua é obrigatória'),
  body('address.number').trim().notEmpty().withMessage('Número é obrigatório'),
  body('address.neighborhood')
    .trim()
    .notEmpty()
    .withMessage('Bairro é obrigatório'),
  body('address.city').trim().notEmpty().withMessage('Cidade é obrigatória'),
  body('address.state').trim().notEmpty().withMessage('Estado é obrigatório'),
  body('address.zipCode').trim().notEmpty().withMessage('CEP é obrigatório'),
  body('emergencyContact.name')
    .trim()
    .notEmpty()
    .withMessage('Nome do contato de emergência é obrigatório'),
  body('emergencyContact.phone')
    .trim()
    .notEmpty()
    .withMessage('Telefone do contato de emergência é obrigatório'),
  body('consentLGPD')
    .isBoolean()
    .withMessage('Consentimento LGPD é obrigatório')
    .custom((value) => value === true)
    .withMessage('É necessário aceitar os termos da LGPD'),
];

export const createAppointmentValidator: ValidationChain[] = [
  body('patientId').isMongoId().withMessage('ID do paciente inválido'),
  body('professionalId').isMongoId().withMessage('ID do profissional inválido'),
  body('type')
    .isIn(Object.values(AppointmentType))
    .withMessage('Tipo de agendamento inválido'),
  body('scheduledDate')
    .isISO8601()
    .withMessage('Data do agendamento inválida')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      return date > now;
    })
    .withMessage('A data do agendamento deve ser no futuro'),
  body('reason').trim().notEmpty().withMessage('Motivo é obrigatório'),
  body('duration')
    .optional()
    .isInt({ min: 15, max: 240 })
    .withMessage('Duração deve estar entre 15 e 240 minutos'),
];

export const idValidator: ValidationChain[] = [
  param('id').isMongoId().withMessage('ID inválido'),
];

export const paginationValidator: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número maior que 0'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve estar entre 1 e 100'),
];
