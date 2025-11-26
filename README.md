# 🚗 Estacione Fácil

<div align="center">
  <img width="1200" height="475" alt="Banner Estacione Fácil" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## 📋 Sobre o Projeto

**Estacione Fácil** é um aplicativo de gerenciamento inteligente de estacionamentos que resolve o problema da gestão manual e ineficiente de vagas.

## 🎯 Problema

Estacionamentos tradicionais enfrentam diversos desafios:
- **Controle Manual Ineficiente**: Anotações em papel são propensas a erros e perdas
- **Falta de Visibilidade**: Impossível saber em tempo real quantas vagas estão disponíveis
- **Dificuldade de Localização**: Clientes esquecem onde estacionaram
- **Gestão de Dados Precária**: Sem histórico ou estatísticas para tomada de decisão
- **Tempo Perdido**: Funcionários gastam tempo procurando veículos e verificando vagas

## 💡 Solução

O **Estacione Fácil** digitaliza completamente a gestão do estacionamento:

### Funcionalidades Principais:
- ✅ **Registro de Entrada/Saída**: Sistema rápido e intuitivo para registro de veículos
- 🗺️ **Mapa Visual do Estacionamento**: Visualização em tempo real de todas as 300 vagas
- 📊 **Dashboard com Estatísticas**: Taxa de ocupação, vagas livres e tempo médio de permanência
- 🔍 **Busca Inteligente**: Encontre qualquer veículo pela placa instantaneamente
- 📱 **Interface Responsiva**: Design moderno e fácil de usar
- ⚡ **Alocação Automática**: Sugestão automática da próxima vaga livre

## 🌟 Justificativa Pessoal

### Por que este app seria útil no dia a dia?

Este aplicativo seria extremamente útil por diversos motivos:

1. **Eficiência Operacional**: Reduz drasticamente o tempo de atendimento, permitindo registrar entradas e saídas em segundos, eliminando filas e melhorando a experiência do cliente.

2. **Controle Financeiro**: Com dados precisos sobre ocupação e tempo de permanência, é possível otimizar preços e identificar horários de pico para melhor alocação de recursos.

3. **Redução de Conflitos**: O sistema evita erros como alocar a mesma vaga para dois veículos ou perder o registro de um carro, prevenindo discussões e problemas legais.

4. **Tomada de Decisão Baseada em Dados**: As estatísticas em tempo real permitem entender padrões de uso, planejar expansões e identificar oportunidades de melhoria.

5. **Experiência do Cliente**: Clientes conseguem localizar seus veículos rapidamente através da busca por placa, reduzindo estresse e melhorando a satisfação.

6. **Escalabilidade**: O sistema suporta até 300 vagas, adequado para estacionamentos de pequeno a médio porte, com possibilidade de expansão.

No contexto de trabalho em um shopping, condomínio ou empresa com estacionamento próprio, este app eliminaria a necessidade de controle manual, reduziria custos operacionais e proporcionaria uma gestão profissional e confiável.

## 📊 DER - Diagrama de Entidade Relacionamento

### Estrutura de Dados da API

```
┌─────────────────────────────────────────┐
│              VEHICLES                   │
├─────────────────────────────────────────┤
│ PK  id (UUID)                           │
│     plate (VARCHAR) UNIQUE NOT NULL     │
│     entryTime (DATETIME) NOT NULL       │
│     exitTime (DATETIME) NULL            │
│ FK  spaceId (VARCHAR) NOT NULL          │
│     status (ENUM: 'parked', 'exited')   │
│     createdAt (TIMESTAMP)               │
│     updatedAt (TIMESTAMP)               │
└─────────────────────────────────────────┘
                    │
                    │ 1:1
                    │
                    ▼
┌─────────────────────────────────────────┐
│           PARKING_SPACES                │
├─────────────────────────────────────────┤
│ PK  id (VARCHAR) e.g., "A01"           │
│     status (ENUM: 'free', 'occupied')   │
│     vehiclePlate (VARCHAR) NULL         │
│     section (CHAR) e.g., 'A'            │
│     number (INT) e.g., 1                │
│     lastOccupiedAt (DATETIME) NULL      │
│     createdAt (TIMESTAMP)               │
│     updatedAt (TIMESTAMP)               │
└─────────────────────────────────────────┘
```

### Relacionamentos:

- **VEHICLES ↔ PARKING_SPACES**: Um veículo ocupa uma vaga (1:1)
- Quando um veículo é estacionado, `PARKING_SPACES.status` = 'occupied' e `PARKING_SPACES.vehiclePlate` é preenchida
- Quando um veículo sai, `VEHICLES.exitTime` é registrado e `PARKING_SPACES.status` retorna para 'free'

### Dados Adicionais (Calculados):

**Estatísticas do Estacionamento** (calculadas em tempo real):
- Total de vagas: 300 (A01-P20)
- Vagas ocupadas: COUNT(spaces WHERE status = 'occupied')
- Vagas livres: 300 - vagas ocupadas
- Taxa de ocupação: (vagas ocupadas / 300) * 100
- Tempo médio de permanência: AVG(exitTime - entryTime) ou AVG(NOW() - entryTime) para veículos ainda estacionados

## 🚀 Como Executar

### Pré-requisitos:
- Node.js (v18+)
- npm ou yarn

### 1️⃣ Instalar Dependências

```bash
# Instalar dependências do frontend
npm install

# Instalar dependências da API
cd api
npm install
cd ..
```

### 2️⃣ Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto (se necessário):

```env
GEMINI_API_KEY=sua_chave_aqui
```

Crie um arquivo `.env` dentro da pasta `/api`:

```env
PORT=3001
NODE_ENV=development
```

### 3️⃣ Iniciar a API

```bash
cd api
npm start
```

A API estará rodando em `http://localhost:3001`

### 4️⃣ Iniciar o Frontend

Em outro terminal:

```bash
npm run dev
```

O app estará disponível em `http://localhost:5173`

## 🛠️ Tecnologias Utilizadas

### Frontend:
- **React** 19.2.0 - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização

### Backend:
- **Node.js** - Runtime
- **Express** - Framework web
- **CORS** - Habilitação de requisições cross-origin

## 📁 Estrutura do Projeto

```
brunao/
├── app/                    # Aplicativo React
│   ├── components/         # Componentes React
│   ├── hooks/             # Custom hooks
│   ├── App.tsx            # Componente principal
│   └── types.ts           # Tipos TypeScript
├── api/                   # API Node.js
│   ├── src/
│   │   ├── controllers/   # Controladores
│   │   ├── routes/        # Rotas da API
│   │   ├── services/      # Lógica de negócio
│   │   └── models/        # Modelos de dados
│   ├── package.json
│   └── server.js
├── .github/
│   └── workflows/         # GitHub Actions
├── package.json
└── README.md
```

## 🧪 Testes e CI/CD

O projeto utiliza **GitHub Actions** para:
- ✅ Executar testes automatizados
- 🔍 Verificar qualidade do código (lint)
- 🏗️ Build do aplicativo

## 📝 Convenções de Commits

Seguimos o padrão de commits semânticos:

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

## 👥 Equipe

Projeto desenvolvido para a disciplina de Desenvolvimento Mobile.

## 📄 Licença

Este projeto é de código aberto para fins educacionais.

## 🔗 Links

- **GitHub**: [Repositório do Projeto](https://github.com/seu-usuario/estacione-facil)
- **API Docs**: Acesse `http://localhost:3001/api-docs` quando a API estiver rodando

---

⭐ Desenvolvido com dedicação para facilitar a gestão de estacionamentos!
