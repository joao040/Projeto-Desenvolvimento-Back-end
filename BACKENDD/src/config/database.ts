import { Sequelize } from 'sequelize-typescript';
import logger from '../utils/logger';
import path from 'path';
import { User } from '../models/User';
import { Patient } from '../models/Patient';
import { Professional } from '../models/Professional';
import { Appointment } from '../models/Appointment';
import { MedicalRecord } from '../models/MedicalRecord';
import { Prescription } from '../models/Prescription';
import { Bed } from '../models/Bed';
import { AuditLog } from '../models/AuditLog';

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'sghss',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '271506',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Adiciona todos os modelos ao Sequelize
sequelize.addModels([
  User,
  Patient,
  Professional,
  Appointment,
  MedicalRecord,
  Prescription,
  Bed,
  AuditLog,
]);

const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('✅ PostgreSQL conectado com sucesso');
    
    // Sincroniza os modelos com o banco (cria tabelas se não existirem)
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    logger.info('✅ Tabelas sincronizadas');
    
  } catch (error) {
    logger.error('❌ Erro ao conectar ao PostgreSQL:', error);
    process.exit(1);
  }
};

export { sequelize };
export default connectDB;
