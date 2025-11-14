# SGHSS - Sistema de Gestão Hospitalar e de Serviços de Saúde

## 📋 Sobre o Projeto

Sistema Backend completo para gestão hospitalar desenvolvido como projeto multidisciplinar. O sistema oferece funcionalidades para gerenciamento de pacientes, profissionais de saúde, agendamentos, prontuários eletrônicos, telemedicina e administração hospitalar.

## 🚀 Tecnologias Utilizadas

- **Node.js 18+** - Runtime JavaScript
- **TypeScript 5.3** - Superset JavaScript com tipagem estática
- **Express 4.18** - Framework web
- **PostgreSQL 14+** - Banco de dados relacional
- **Sequelize** - ORM para PostgreSQL com suporte a TypeScript
- **JWT** - Autenticação via tokens
- **Bcrypt** - Criptografia de senhas
- **Swagger/OpenAPI** - Documentação da API
- **Winston** - Sistema de logs estruturados
- **Helmet** - Segurança HTTP
- **Express Rate Limit** - Proteção contra ataques
- **Express Validator** - Validação de dados



## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd BACKENDD
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o PostgreSQL:
```bash
# Certifique-se de ter o PostgreSQL instalado e rodando
# Crie o banco de dados:
psql -U postgres
CREATE DATABASE sghss;
\q
```

4. Configure as variáveis de ambiente (.env):
```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=sghss
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

JWT_SECRET=seu_secret_muito_seguro_aqui
JWT_REFRESH_SECRET=seu_refresh_secret_muito_seguro_aqui
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

ALLOWED_ORIGINS=http://localhost:3001
```

5. Execute o projeto em modo desenvolvimento:
```bash
npm run dev
```

O servidor irá:
- Conectar ao PostgreSQL
- Sincronizar os modelos (criar/atualizar tabelas automaticamente)
- Iniciar na porta 3000

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Inicia o servidor em produção
- `npm test` - Executa os testes
- `npm run lint` - Verifica o código com ESLint
- `npm run lint:fix` - Corrige problemas do ESLint automaticamente

## 🔐 Funcionalidades de Segurança

- ✅ Autenticação JWT
- ✅ Criptografia de senhas com Bcrypt
- ✅ Criptografia de dados sensíveis (LGPD)
- ✅ Rate limiting para prevenir ataques
- ✅ Helmet para headers de segurança
- ✅ CORS configurável
- ✅ Validação de entrada de dados
- ✅ Logs de auditoria
- ✅ Controle de acesso baseado em perfis (RBAC)

## 📚 Documentação da API

Após iniciar o servidor, acesse a documentação Swagger em:
```
http://localhost:3000/api-docs
```

## 🏥 Principais Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Logout

### Pacientes
- `GET /api/patients` - Listar pacientes
- `POST /api/patients` - Cadastrar paciente
- `GET /api/patients/:id` - Buscar paciente
- `PUT /api/patients/:id` - Atualizar paciente
- `DELETE /api/patients/:id` - Remover paciente

### Profissionais
- `GET /api/professionals` - Listar profissionais
- `POST /api/professionals` - Cadastrar profissional
- `GET /api/professionals/:id` - Buscar profissional
- `PUT /api/professionals/:id` - Atualizar profissional

### Agendamentos
- `GET /api/appointments` - Listar agendamentos
- `POST /api/appointments` - Criar agendamento
- `PUT /api/appointments/:id` - Atualizar agendamento
- `DELETE /api/appointments/:id` - Cancelar agendamento

### Prontuários
- `GET /api/medical-records` - Listar prontuários
- `POST /api/medical-records` - Criar prontuário
- `GET /api/medical-records/patient/:patientId` - Prontuários do paciente

### Telemedicina
- `POST /api/telemedicine/session` - Iniciar sessão
- `GET /api/telemedicine/sessions` - Listar sessões
- `PUT /api/telemedicine/session/:id/end` - Finalizar sessão

## 👥 Perfis de Usuário

- **ADMIN** - Administrador do sistema
- **DOCTOR** - Médico
- **NURSE** - Enfermeiro
- **RECEPTIONIST** - Recepcionista
- **PATIENT** - Paciente

## 🔒 Conformidade LGPD

O sistema implementa:
- Criptografia de dados sensíveis
- Logs de acesso e auditoria
- Controle de consentimento
- Direito ao esquecimento
- Minimização de dados
- Anonimização quando aplicável

## 📊 Requisitos Não Funcionais Atendidos

- **Escalabilidade**: Pool de conexões PostgreSQL, arquitetura MVC
- **Performance**: Índices otimizados, queries eficientes com Sequelize
- **Disponibilidade**: Rate limiting, error handling robusto
- **Segurança**: Múltiplas camadas de segurança implementadas
- **Manutenibilidade**: TypeScript, código limpo, separação de responsabilidades

## 🗄️ Estrutura do Banco de Dados

O sistema utiliza PostgreSQL com as seguintes tabelas principais:

- **users** - Usuários do sistema (admin, médicos, enfermeiros, recepcionistas)
- **patients** - Cadastro de pacientes
- **professionals** - Profissionais de saúde com especialidades
- **appointments** - Agendamentos de consultas
- **medical_records** - Prontuários médicos
- **prescriptions** - Prescrições médicas
- **beds** - Gestão de leitos hospitalares
- **audit_logs** - Logs de auditoria LGPD

## 🧪 Testando a API

Exemplos de requisições usando PowerShell:

### Registrar usuário
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"medico@hospital.com","password":"Senha123","firstName":"João","lastName":"Silva","phone":"11987654321","role":"DOCTOR"}'
```

### Login
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"medico@hospital.com","password":"Senha123"}'
```

### Acessar endpoint protegido
```powershell
$token = "seu_token_aqui"
Invoke-RestMethod -Uri "http://localhost:3000/api/patients" `
  -Method GET `
  -Headers @{Authorization="Bearer $token"}
```


## 🔄 Migrações e Sincronização

Em desenvolvimento, o Sequelize sincroniza automaticamente as tabelas:
```typescript
await sequelize.sync({ alter: true });
```

Para produção, recomenda-se usar migrations:
```bash
npm install --save-dev sequelize-cli
npx sequelize-cli migration:generate --name nome-da-migration
npx sequelize-cli db:migrate
```

