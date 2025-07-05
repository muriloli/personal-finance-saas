# Guia de Instalação Local - FinanceFlow

Este guia explica como executar o projeto FinanceFlow localmente na sua máquina.

## Pré-requisitos

Você precisa ter instalado:

1. **Node.js** (versão 18 ou superior)
   - Download: https://nodejs.org/
   - Verifique com: `node --version`

2. **PostgreSQL** (versão 13 ou superior)
   - Download: https://www.postgresql.org/download/
   - Ou use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=sua_senha -p 5432:5432 -d postgres`

3. **Git** (para clonar o projeto)
   - Download: https://git-scm.com/

## Passo a Passo para Instalação

### 1. Extrair o Projeto
```bash
# Extraia o arquivo ZIP baixado do Replit
# Navegue até a pasta do projeto
cd pasta-do-projeto
```

### 2. Instalar Dependências
```bash
# Instalar as dependências do Node.js
npm install
```

### 3. Configurar Banco de Dados

#### Opção A: PostgreSQL Local
```bash
# Criar banco de dados
createdb financeflow

# Ou usando psql:
psql -U postgres
CREATE DATABASE financeflow;
\q
```

#### Opção B: Docker (Recomendado)
```bash
# Executar PostgreSQL com Docker
docker run --name financeflow-db \
  -e POSTGRES_DB=financeflow \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -p 5432:5432 \
  -d postgres:15

# Aguarde alguns segundos para o container inicializar
```

### 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Para PostgreSQL local:
DATABASE_URL=postgresql://postgres:sua_senha@localhost:5432/financeflow

# Para Docker:
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/financeflow

# Outras variáveis necessárias:
NODE_ENV=development
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=sua_senha_aqui
PGDATABASE=financeflow
```

### 5. Configurar Esquema do Banco

```bash
# Criar as tabelas no banco de dados
npm run db:push
```

### 6. Executar o Projeto

```bash
# Executar em modo desenvolvimento
npm run dev
```

O projeto estará disponível em: http://localhost:5000

## Scripts Disponíveis

- `npm run dev` - Executa o projeto em desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run start` - Executa a versão de produção
- `npm run db:push` - Aplica mudanças no esquema do banco
- `npm run check` - Verifica tipos TypeScript

## Estrutura do Projeto

```
projeto/
├── client/          # Frontend React
├── server/          # Backend Express
├── shared/          # Tipos e schemas compartilhados
├── package.json     # Dependências e scripts
├── .env            # Variáveis de ambiente (criar)
└── README.md       # Este arquivo
```

## Usuário de Teste

Após a instalação, use estas credenciais para fazer login:

- **CPF**: `12345678901`
- **Nome**: Usuário Teste

## Funcionalidades

- ✅ Dashboard financeiro
- ✅ Cadastro de transações
- ✅ Filtros e ordenação
- ✅ Modo claro/escuro
- ✅ Gráficos e análises
- ✅ Autenticação por CPF
- ✅ Sistema responsivo

## Solução de Problemas

### Erro de Conexão com Banco
```bash
# Verificar se PostgreSQL está rodando
ps aux | grep postgres

# Ou com Docker:
docker ps
```

### Erro de Porta Ocupada
```bash
# Verificar o que está usando a porta 5000
lsof -i :5000

# Matar processo se necessário
kill -9 PID_DO_PROCESSO
```

### Erro de Dependências
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro no Banco de Dados
```bash
# Recriar as tabelas
npm run db:push
```

## Desenvolvimento

Para contribuir ou modificar o projeto:

1. Faça suas alterações
2. Teste localmente com `npm run dev`
3. Verifique tipos com `npm run check`
4. Compile para produção com `npm run build`

## Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Banco**: PostgreSQL, Drizzle ORM
- **Build**: Vite, ESBuild
- **Estado**: TanStack Query

## Suporte

Se encontrar problemas, verifique:

1. Versões do Node.js e PostgreSQL
2. Variáveis de ambiente no arquivo `.env`
3. Se o banco de dados está rodando
4. Se todas as dependências foram instaladas

Para dúvidas específicas, consulte os logs de erro no terminal.