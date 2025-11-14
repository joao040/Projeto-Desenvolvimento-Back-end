import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { User } from './User';
import { Gender, BloodType } from '../types';

@Table({
  tableName: 'patients',
  timestamps: true,
})
export class Patient extends Model {
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
    type: DataType.DATE,
    allowNull: false,
  })
  dateOfBirth!: Date;

  @Column({
    type: DataType.ENUM(...Object.values(Gender)),
    allowNull: false,
  })
  gender!: Gender;

  @Column({
    type: DataType.ENUM(...Object.values(BloodType)),
    allowNull: true,
  })
  bloodType?: BloodType;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  address!: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  emergencyContact!: {
    name: string;
    relationship: string;
    phone: string;
  };

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  allergies?: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  chronicDiseases?: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  medications?: string[];

  @Column({
    type: DataType.STRING,
  })
  insuranceProvider?: string;

  @Column({
    type: DataType.STRING,
  })
  insuranceNumber?: string;

  @Column({
    type: DataType.TEXT,
  })
  observations?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  consentLGPD!: boolean;

  @Column({
    type: DataType.DATE,
  })
  consentDate?: Date;
}
