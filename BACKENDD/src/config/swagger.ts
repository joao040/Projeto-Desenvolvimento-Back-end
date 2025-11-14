import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SGHSS - Sistema de Gestão Hospitalar API',
      version: '1.0.0',
      description: 'API RESTful para Sistema de Gestão Hospitalar e de Serviços de Saúde',
      contact: {
        name: 'Suporte SGHSS',
        email: 'suporte@sghss.com.br',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
      {
        url: 'https://api.sghss.com.br',
        description: 'Servidor de Produção',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: 'Auth', description: 'Autenticação e autorização' },
      { name: 'Patients', description: 'Gestão de pacientes' },
      { name: 'Professionals', description: 'Gestão de profissionais de saúde' },
      { name: 'Appointments', description: 'Agendamentos e consultas' },
      { name: 'Medical Records', description: 'Prontuários eletrônicos' },
      { name: 'Prescriptions', description: 'Receitas e prescrições' },
      { name: 'Telemedicine', description: 'Telemedicina e teleconsultas' },
      { name: 'Beds', description: 'Gestão de leitos' },
      { name: 'Reports', description: 'Relatórios gerenciais' },
      { name: 'Audit', description: 'Logs de auditoria' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
