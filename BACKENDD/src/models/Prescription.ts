import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { Patient } from './Patient';
import { Professional } from './Professional';
import { MedicalRecord } from './MedicalRecord';
import { PrescriptionStatus } from '../types';

@Table({
  tableName: 'prescriptions',
  timestamps: true,
})
export class Prescription extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => Patient)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  patientId!: string;

  @BelongsTo(() => Patient)
  patient!: Patient;

  @ForeignKey(() => Professional)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  professionalId!: string;

  @BelongsTo(() => Professional)
  professional!: Professional;

  @ForeignKey(() => MedicalRecord)
  @Column({
    type: DataType.UUID,
  })
  medicalRecordId?: string;

  @BelongsTo(() => MedicalRecord)
  medicalRecord?: MedicalRecord;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  medications!: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];

  @Column({
    type: DataType.ENUM(...Object.values(PrescriptionStatus)),
    defaultValue: PrescriptionStatus.PENDING,
  })
  @Index
  status!: PrescriptionStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  @Index
  issuedDate!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  validUntil!: Date;

  @Column({
    type: DataType.TEXT,
  })
  notes?: string;

  @Column({
    type: DataType.TEXT,
  })
  digitalSignature?: string;
}
