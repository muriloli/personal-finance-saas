# FinanceFlow - Personal Finance Management

Sistema completo de gestão financeira pessoal com dashboard, gestão de transações e relatórios.

## 🚀 Configuração Rápida

### 1. Clonando o projeto
```bash
git clone <seu-repositorio>
cd financeflow
```

### 2. Configurando o banco de dados (Supabase)

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. Crie um novo projeto ou selecione um existente
3. Clique em **"Connect"** no topo da página
4. Copie a URI da seção **"Connection string"** → **"Transaction pooler"**
5. Substitua `[YOUR-PASSWORD]` pela sua senha do banco

### 3. Configurando variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env e configure sua DATABASE_URL
nano .env
```

Exemplo de `.env`:
```env
DATABASE_URL=postgresql://postgres:sua_senha_aqui@db.xyzabc123def.supabase.co:5432/postgres
NODE_ENV=development
```

### 4. Instalando dependências e rodando o projeto
```bash
# Instalar dependências
npm install

# Criar tabelas no banco (primeira vez)
npm run db:push

# Iniciar o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em: `http://localhost:5000`

## 📱 Como usar

### Login
- Use o CPF de teste: `12345678901`
- O sistema criará automaticamente um usuário de teste na primeira execução

### Funcionalidades principais
- **Dashboard**: Visão geral das finanças
- **Transações**: Adicionar, editar e visualizar transações
- **Relatórios**: Gráficos e análises
- **Configurações**: Personalizar preferências
- **Exportação**: Download de dados em CSV

## 🛠️ Scripts disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start

# Verificar tipos TypeScript
npm run check

# Atualizar schema do banco
npm run db:push
```

## 🗄️ Estrutura do banco

O sistema cria automaticamente:
- Usuários e sessões
- Categorias padrão (alimentação, transporte, etc.)
- Configurações de usuário
- Logs do sistema

## 🔧 Tecnologias

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Banco**: PostgreSQL (Supabase)
- **ORM**: Drizzle
- **Build**: Vite

## 📋 Dados de teste

- **CPF**: 12345678901
- **Nome**: Usuário Teste
- **Telefone**: +5511999999999

## 🐛 Resolução de problemas

### Erro de conexão com banco
- Verifique se a `DATABASE_URL` está correta
- Confirme se o projeto Supabase está ativo
- Teste a conexão diretamente no Supabase

### Erro 401 (Unauthorized)
- Faça logout e login novamente
- Limpe o localStorage do navegador
- Verifique se o usuário de teste existe

### Tabelas não encontradas
```bash
npm run db:push
```

## 🌟 Próximos passos

1. Configure sua própria URL de banco
2. Personalize as categorias conforme necessário
3. Adicione suas transações reais
4. Configure notificações e relatórios

---

Desenvolvido com ❤️ para gestão financeira pessoal