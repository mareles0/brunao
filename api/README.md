# Estacione Fácil - API

API REST para sistema de gerenciamento de estacionamento com autenticação e controle de vagas.

## Tecnologias

- Node.js + Express
- Supabase (PostgreSQL + Auth)
- JWT Authentication

## Instalação Local

```bash
npm install
npm start
```

## Variáveis de Ambiente

```env
PORT=3001
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deploy

Deploy automático no Render via GitHub. Ver `render.yaml` para configuração.

## Endpoints

- `GET /` - Health check
- `GET /api/spaces` - Listar vagas
- `POST /api/sessions/park` - Estacionar veículo
- `POST /api/sessions/exit` - Registrar saída
- `GET /api/sessions/my` - Minhas sessões
- `GET /api/stats` - Estatísticas (com role-based access)

## Scripts Úteis

```bash
# Criar usuário admin
node src/scripts/createAdmin.js

# Limpar vagas ocupadas
node src/scripts/cleanSpaces.js
```

## Licença

MIT
