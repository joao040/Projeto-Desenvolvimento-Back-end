const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '271506',
  database: 'postgres', // conecta ao postgres padrão primeiro
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Conectado ao PostgreSQL!');
    
    // Verifica se o banco sghss existe
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname='sghss'");
    
    if (res.rowCount === 0) {
      console.log('📦 Criando banco de dados sghss...');
      await client.query('CREATE DATABASE sghss');
      console.log('✅ Banco sghss criado com sucesso!');
    } else {
      console.log('✅ Banco sghss já existe!');
    }
    
    await client.end();
    console.log('✅ Teste concluído!');
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

testConnection();
