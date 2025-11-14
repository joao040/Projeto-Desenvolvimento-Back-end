import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { Patient } from './Patient';
import { BedStatus } from '../types';

@Table({
  tableName: 'beds',
  timestamps: true,
})
export class Bed extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @Index
  unitId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @Index
  bedNumber!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @Index
  ward!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @Index
  floor!: number;

  @Column({
    type: DataType.ENUM(...Object.values(BedStatus)),
    defaultValue: BedStatus.AVAILABLE,
  })
  @Index
  status!: BedStatus;

  @ForeignKey(() => Patient)
  @Column({
    type: DataType.UUID,
  })
  patientId?: string;

  @BelongsTo(() => Patient)
  patient?: Patient;

  @Column({
    type: DataType.DATE,
  })
  occupiedSince?: Date;

  @Column({
    type: DataType.DATE,
  })
  lastCleaned?: Date;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  features?: string[];

  @Column({
    type: DataType.TEXT,
  })
  notes?: string;
}
