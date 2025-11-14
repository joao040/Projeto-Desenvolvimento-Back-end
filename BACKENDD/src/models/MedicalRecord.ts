import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { Patient } from './Patient';
import { Professional } from './Professional';
import { Appointment } from './Appointment';

@Table({
  tableName: 'medical_records',
  timestamps: true,
})
export class MedicalRecord extends Model {
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

  @ForeignKey(() => Appointment)
  @Column({
    type: DataType.UUID,
  })
  appointmentId?: string;

  @BelongsTo(() => Appointment)
  appointment?: Appointment;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  date!: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  diagnosis!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  symptoms!: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  treatmentPlan!: string;

  @Column({
    type: DataType.TEXT,
  })
  notes?: string;

  @Column({
    type: DataType.JSONB,
  })
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    oxygenSaturation?: number;
  };

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  attachments?: {
    filename: string;
    fileType: string;
    fileUrl: string;
    uploadedAt: Date;
  }[];

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isConfidential!: boolean;
}
