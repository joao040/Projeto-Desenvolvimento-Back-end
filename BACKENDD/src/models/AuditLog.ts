import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { User } from './User';

@Table({
  tableName: 'audit_logs',
  timestamps: false,
})
export class AuditLog extends Model {
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
  })
  @Index
  userId!: string;

  @BelongsTo(() => User)
  user!: User;

  @Column({
    type: DataType.ENUM('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'PRINT'),
    allowNull: false,
  })
  action!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @Index
  resource!: string;

  @Column({
    type: DataType.STRING,
  })
  resourceId?: string;

  @Column({
    type: DataType.JSONB,
  })
  details?: any;

  @Column({
    type: DataType.STRING,
  })
  ipAddress?: string;

  @Column({
    type: DataType.STRING,
  })
  userAgent?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  @Index
  timestamp!: Date;
}
