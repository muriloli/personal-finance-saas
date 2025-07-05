#!/usr/bin/env node

/**
 * Script de configuração inicial do FinanceFlow
 * Execute: node setup.js
 */

import fs from 'fs';
import path from 'path';

console.log('🚀 Configurando FinanceFlow...\n');

// 1. Verificar se o .env existe
if (!fs.existsSync('.env')) {
  console.log('📝 Criando arquivo .env...');
  try {
    fs.copyFileSync('.env.example', '.env');
    console.log('✅ Arquivo .env criado com sucesso!');
    console.log('⚠️  IMPORTANTE: Edite o arquivo .env com suas credenciais do banco de dados\n');
  } catch (error) {
    console.log('❌ Erro ao criar .env:', error.message);
  }
} else {
  console.log('✅ Arquivo .env já existe\n');
}

// 2. Verificar package.json
console.log('📦 Verificando dependências...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`✅ Projeto: ${packageJson.name} v${packageJson.version}`);
  console.log('✅ Dependências configuradas\n');
} catch (error) {
  console.log('❌ Erro ao ler package.json:', error.message);
}

// 3. Instruções finais
console.log('📋 PRÓXIMOS PASSOS:');
console.log('');
console.log('1. 🔧 Configure o banco de dados:');
console.log('   Docker: docker run --name financeflow-db -e POSTGRES_DB=financeflow -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres123 -p 5432:5432 -d postgres:15');
console.log('   Local:  createdb financeflow');
console.log('');
console.log('2. 📝 Edite o arquivo .env com suas credenciais');
console.log('');
console.log('3. 📦 Instale as dependências:');
console.log('   npm install');
console.log('');
console.log('4. 🗄️  Configure o banco de dados:');
console.log('   npm run db:push');
console.log('');
console.log('5. 🚀 Execute o projeto:');
console.log('   npm run dev');
console.log('');
console.log('6. 🌐 Acesse: http://localhost:5000');
console.log('   Login: CPF 12345678901');
console.log('');
console.log('✨ Pronto! Seu FinanceFlow estará rodando!');