import { Response, NextFunction } from 'express';
import { AuditLog } from '../models/AuditLog';
import { AuthRequest } from './auth';
import logger from '../utils/logger';

export const auditLog = (action: string, resource: string) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const resourceId = req.params.id;
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('user-agent');

      // Cria o log de auditoria
      await AuditLog.create({
        userId,
        action,
        resource,
        resourceId,
        details: {
          method: req.method,
          path: req.path,
          body: sanitizeBody(req.body),
          query: req.query,
        },
        ipAddress,
        userAgent,
        timestamp: new Date(),
      });

      logger.info('Audit log created', {
        userId,
        action,
        resource,
        resourceId,
        ipAddress,
      });

      next();
    } catch (error) {
      logger.error('Error creating audit log:', error);
      // Não bloqueia a requisição mesmo em caso de erro no log
      next();
    }
  };
};

// Remove dados sensíveis do body antes de logar
const sanitizeBody = (body: any): any => {
  if (!body) return body;

  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'cpf', 'creditCard'];

  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });

  return sanitized;
};
