import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { User } from './User';
import { Specialization } from '../types';

@Table({
  tableName: 'professionals',
  timestamps: true,
})
export class Professional extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  @Index
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @Column({
    type: DataType.ENUM(...Object.values(Specialization)),
    allowNull: false,
  })
  @Index
  specialization!: Specialization;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  @Index
  licenseNumber!: string;

  @Column({
    type: DataType.STRING(2),
    allowNull: false,
  })
  licenseState!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  qualifications!: string[];

  @Column({
    type: DataType.TEXT,
  })
  bio?: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  consultationFee?: number;

  @Column({
    type: DataType.JSONB,
    defaultValue: [],
  })
  workSchedule!: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    unitId?: string;
  }[];

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isAvailableForTelemedicine!: boolean;
}
