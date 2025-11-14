export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  PATIENT = 'PATIENT',
  TECHNICIAN = 'TECHNICIAN',
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum AppointmentType {
  CONSULTATION = 'CONSULTATION',
  EXAM = 'EXAM',
  PROCEDURE = 'PROCEDURE',
  TELEMEDICINE = 'TELEMEDICINE',
  RETURN = 'RETURN',
  EMERGENCY = 'EMERGENCY',
}

export enum BedStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  RESERVED = 'RESERVED',
  CLEANING = 'CLEANING',
}

export enum PrescriptionStatus {
  PENDING = 'PENDING',
  DISPENSED = 'DISPENSED',
  CANCELLED = 'CANCELLED',
}

export enum TelemedicineStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

export enum Specialization {
  CARDIOLOGY = 'CARDIOLOGY',
  DERMATOLOGY = 'DERMATOLOGY',
  ENDOCRINOLOGY = 'ENDOCRINOLOGY',
  GASTROENTEROLOGY = 'GASTROENTEROLOGY',
  GENERAL_PRACTICE = 'GENERAL_PRACTICE',
  GYNECOLOGY = 'GYNECOLOGY',
  NEUROLOGY = 'NEUROLOGY',
  ONCOLOGY = 'ONCOLOGY',
  OPHTHALMOLOGY = 'OPHTHALMOLOGY',
  ORTHOPEDICS = 'ORTHOPEDICS',
  OTOLARYNGOLOGY = 'OTOLARYNGOLOGY',
  PEDIATRICS = 'PEDIATRICS',
  PSYCHIATRY = 'PSYCHIATRY',
  PULMONOLOGY = 'PULMONOLOGY',
  RADIOLOGY = 'RADIOLOGY',
  SURGERY = 'SURGERY',
  UROLOGY = 'UROLOGY',
}

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: IPagination;
}
