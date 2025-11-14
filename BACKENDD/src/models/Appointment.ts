import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { Patient } from './Patient';
import { Professional } from './Professional';
import { User } from './User';
import { AppointmentStatus, AppointmentType } from '../types';

@Table({
  tableName: 'appointments',
  timestamps: true,
})
export class Appointment extends Model {
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

  @Column({
    type: DataType.ENUM(...Object.values(AppointmentType)),
    allowNull: false,
  })
  type!: AppointmentType;

  @Column({
    type: DataType.ENUM(...Object.values(AppointmentStatus)),
    defaultValue: AppointmentStatus.SCHEDULED,
  })
  @Index
  status!: AppointmentStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @Index
  scheduledDate!: Date;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 30,
  })
  duration!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reason!: string;

  @Column({
    type: DataType.TEXT,
  })
  notes?: string;

  @Column({
    type: DataType.UUID,
  })
  unitId?: string;

  @Column({
    type: DataType.STRING,
  })
  roomNumber?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isTelemedicine!: boolean;

  @Column({
    type: DataType.STRING,
  })
  telemedicineLink?: string;

  @Column({
    type: DataType.TEXT,
  })
  cancelReason?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  cancelledBy?: string;

  @Column({
    type: DataType.DATE,
  })
  cancelledAt?: Date;
}
