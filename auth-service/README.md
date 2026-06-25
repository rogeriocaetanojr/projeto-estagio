# Microsserviço de Autenticação (Auth Service)

Microsserviço responsável pela autenticação, cadastro e gestão de perfis de usuários do portal UniSenai PR. Atua como **Produtor** na arquitetura de eventos, publicando o evento `user_registered` na Exchange `user.events` do RabbitMQ para que os demais módulos consumidores espelhem os dados do usuário localmente.

## Funcionalidades

- Cadastro de usuários com perfil **Student** (Aluno) ou **Professor**.
- Login com validação de credenciais via **bcrypt** e emissão de **JWT**.
- Consulta e atualização de perfil autenticado.
- Publicação assíncrona do evento `user_registered` via RabbitMQ (Exchange `fanout`).
- Configurações dinâmicas de perfil armazenadas em coluna `jsonb` (tema, notificações).
- Servir os Micro-Frontends de Login/Cadastro e Perfil do Usuário como arquivos estáticos.

## Rotas HTTP

A API roda na porta `3001` por padrão.

| Método | Rota | Descrição | Proteção |
|--------|------|-----------|----------|
| `POST` | `/auth/register` | Cadastra um novo usuário (Student ou Professor) e dispara o evento `user_registered`. | Pública |
| `POST` | `/auth/login` | Valida as credenciais (bcrypt) e retorna `{ access_token, user }`. | Pública |
| `GET`  | `/auth/me` | Retorna os dados completos do usuário autenticado. | JWT (Bearer) |
| `PATCH` | `/auth/profile` | Atualiza os dados do perfil do usuário autenticado (nome, settings). | JWT (Bearer) |

### Exemplo de Autenticação
```http
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "email": "aluno@email.com",
  "password": "senha123"
}
```

Resposta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "aluno@email.com",
    "name": "João Silva",
    "profileType": "student"
  }
}
```

## Modelagem de Dados

O serviço utiliza o padrão **Class Table Inheritance** para modelar os perfis de usuário:

```
User (tabela pai)
├── id (UUID, PK)
├── email (unique)
├── password (hash bcrypt)
├── name
├── settings (JSON)
│
├── Student (tabela filha, relação 1:1)
│   ├── ra (Registro Acadêmico, unique)
│   └── periodo (período letivo)
│
└── Professor (tabela filha, relação 1:1)
    ├── matricula (unique)
    └── titulacao
```

## Evento Publicado: `user_registered`

Ao cadastrar um usuário, o serviço publica o seguinte evento na Exchange `user.events` (tipo `fanout`):

```json
{
  "pattern": "user_registered",
  "data": {
    "id": "uuid-do-usuario",
    "email": "usuario@dominio.com",
    "profileType": "student"
  }
}
```

> **Atenção:** O campo `profileType` é sempre enviado em **minúsculas** (`student` ou `professor`). O contrato está tipado em `src/events/contracts.ts`.

## Micro-Frontends Servidos

Este serviço disponibiliza os seguintes Web Components como arquivos estáticos na pasta `public/`:

| Componente | Arquivo | Tag HTML | Descrição |
|------------|---------|----------|-----------|
| Login / Cadastro | `auth-element.js` | `<auth-element>` | Tela de autenticação com alternância login/cadastro. |
| Perfil do Usuário | `profile-element.js` | `<profile-element>` | Página de perfil com detalhes acadêmicos, postagens e comunidades criadas. |

## Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | String de conexão do PostgreSQL (schema `auth`) | `postgresql://root:rootpassword@localhost:5432/microservices_db?schema=auth` |
| `RABBITMQ_URL` | String de conexão do RabbitMQ | `amqp://guest:guest@localhost:5672` |
| `JWT_SECRET` | Chave simétrica para assinatura dos tokens JWT | `minha-chave-secreta` |
| `PORT` | Porta HTTP do serviço | `3001` |

> **Importante:** A variável `JWT_SECRET` deve ser **idêntica** em todos os microsserviços que validam o token localmente.

## Como Rodar

```bash
# 1. Instalar dependências
npm install

# 2. Copiar variáveis de ambiente
cp .env.example .env

# 3. Gerar o Prisma Client
npx prisma generate

# 4. Executar as migrations
npx prisma migrate dev

# 5. Iniciar em modo de desenvolvimento
npm run start:dev
```

## Estrutura de Pastas

```
auth-service/
├── prisma/
│   └── schema.prisma          # Modelagem de dados (User, Student, Professor)
├── public/
│   ├── auth-element.js        # MFE: Login/Cadastro (Web Component / Lit)
│   └── profile-element.js     # MFE: Perfil do Usuário (Web Component / Lit)
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts # Rotas HTTP (/auth/*)
│   │   ├── auth.service.ts    # Lógica de negócio (registro, login, perfil)
│   │   ├── dto/               # Data Transfer Objects (validação de entrada)
│   │   ├── guards/            # JwtAuthGuard (proteção de rotas)
│   │   └── strategies/        # JwtStrategy (validação local do token)
│   ├── events/
│   │   └── contracts.ts       # Contrato tipado do evento user_registered
│   ├── prisma/
│   │   └── prisma.service.ts  # Serviço do Prisma ORM
│   ├── app.module.ts          # Módulo raiz (NestJS)
│   └── main.ts                # Bootstrap do servidor HTTP + CORS
├── test/                      # Testes unitários
├── .env.example
├── Dockerfile
└── package.json
```

## Tecnologias

- [NestJS](https://nestjs.com/) · [Prisma](https://www.prisma.io/) · [PostgreSQL](https://www.postgresql.org/) · [RabbitMQ](https://www.rabbitmq.com/) · [Passport/JWT](https://docs.nestjs.com/security/authentication) · [Lit](https://lit.dev/)
