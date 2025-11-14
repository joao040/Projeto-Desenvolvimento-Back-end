import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production-32c';

/**
 * Criptografa dados sensíveis (LGPD compliance)
 */
export const encrypt = (text: string): string => {
  try {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  } catch (error) {
    throw new Error('Erro ao criptografar dados');
  }
};

/**
 * Descriptografa dados sensíveis
 */
export const decrypt = (encryptedText: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new Error('Erro ao descriptografar dados');
  }
};

/**
 * Hash de dados para comparação sem armazenar o original
 */
export const hash = (text: string): string => {
  return CryptoJS.SHA256(text).toString();
};

/**
 * Anonimiza dados pessoais para relatórios
 */
export const anonymize = (text: string): string => {
  if (!text) return '';
  
  const length = text.length;
  if (length <= 3) return '***';
  
  const visibleChars = Math.floor(length * 0.3);
  const start = text.substring(0, visibleChars);
  const asterisks = '*'.repeat(length - visibleChars);
  
  return start + asterisks;
};

/**
 * Mascara CPF mantendo apenas os últimos 3 dígitos
 */
export const maskCPF = (cpf: string): string => {
  if (!cpf || cpf.length !== 11) return '***.***.***-**';
  return `***.***.*${cpf.substring(8, 11)}-**`;
};

/**
 * Mascara email mantendo parte do usuário e domínio
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return '***@***.***';
  
  const [user, domain] = email.split('@');
  const maskedUser = user.substring(0, 2) + '***';
  const [domainName, domainExt] = domain.split('.');
  const maskedDomain = domainName.substring(0, 1) + '***';
  
  return `${maskedUser}@${maskedDomain}.${domainExt}`;
};
