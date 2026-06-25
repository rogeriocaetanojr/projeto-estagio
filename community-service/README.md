# Microsserviço de Comunidade (Community Service)

Microsserviço responsável pelo sistema de comunidades, feed de postagens, interações sociais (likes, comentários) e upload de anexos do portal UniSenai PR. Atua como **Consumidor** na arquitetura de eventos, recebendo o evento `user_registered` e espelhando os dados do usuário localmente via **Table Mirroring**.

## Funcionalidades

- **Comunidades:** Criação, listagem, edição e exclusão de comunidades com suporte a senha (comunidades trancadas).
- **Membros:** Entrada e saída de comunidades, com controle de acesso por senha.
- **Posts:** CRUD completo de publicações vinculadas a comunidades.
- **Likes:** Sistema de curtidas com toggle (curtir/descurtir) por usuário.
- **Comentários:** Comentários em posts com suporte a respostas aninhadas (threads).
- **Anexos:** Upload de arquivos com limite dinâmico por tipo de perfil (Strategy Pattern).
- **Table Mirroring:** Espelhamento assíncrono dos dados de usuário recebidos via RabbitMQ.
- **Micro-Frontend:** Serve o Web Component de Comunidade (`community-element`) como arquivo estático.

## Rotas HTTP

A API roda na porta `3002` por padrão.

### Comunidades (`/communities`)

| Método | Rota | Descrição | Proteção |
|--------|------|-----------|----------|
| `POST` | `/communities` | Cria uma nova comunidade. | Pública |
| `GET` | `/communities` | Lista todas as comunidades. | Pública |
| `GET` | `/communities/:id` | Retorna os detalhes de uma comunidade. | Pública |
| `PATCH` | `/communities/:id` | Atualiza uma comunidade existente. | Pública |
| `DELETE` | `/communities/:id` | Exclui uma comunidade (apenas o dono). | JWT (Bearer) |
| `DELETE` | `/communities/:id/leave` | Sai de uma comunidade. | JWT (Bearer) |
| `POST` | `/communities/:id/join` | Entra em uma comunidade (com senha se trancada). | Pública |

### Posts (`/posts`)

| Método | Rota | Descrição | Proteção |
|--------|------|-----------|----------|
| `POST` | `/posts` | Cria um novo post. | Pública |
| `GET` | `/posts` | Lista posts (filtros via query params). | Pública |
| `GET` | `/posts/:id` | Retorna os detalhes de um post. | Pública |
| `PATCH` | `/posts/:id` | Atualiza um post existente. | Pública |
| `DELETE` | `/posts/:id` | Exclui um post. | Pública |
| `POST` | `/posts/:id/attachments` | Faz upload de um anexo para o post (`multipart/form-data`). | Pública |
| `POST` | `/posts/:id/likes` | Curtir/descurtir um post (toggle). | Pública |
| `POST` | `/posts/:id/comments` | Adiciona um comentário ao post. | Pública |
| `PATCH` | `/posts/:id/comments/:commentId` | Edita um comentário. | Pública |
| `DELETE` | `/posts/:id/comments/:commentId` | Exclui um comentário. | Pública |

## Modelagem de Dados

O serviço utiliza **Table Mirroring** para espelhar os dados de usuário recebidos via evento:

```
UserMirror (espelho do auth-service)
├── id (UUID, PK - mesmo ID do auth-service)
├── email (unique)
├── name
└── profileType (student | professor)

Community
├── id (UUID, PK)
├── name
├── description
├── isLocked (Boolean)
├── passwordHash
├── ownerId → UserMirror
├── members[] → CommunityMember
└── posts[] → Post

Post
├── id (UUID, PK)
├── title
├── content
├── authorId → UserMirror
├── communityId → Community (opcional)
├── attachments[] → Attachment
├── comments[] → Comment
└── likes[] → Like

Comment (suporte a threads via self-relation)
├── id (UUID, PK)
├── content
├── authorId → UserMirror
├── postId → Post
├── parentId → Comment (nullable, para respostas)
└── replies[] → Comment

Like (unique por [postId, userId])
├── postId → Post
└── userId → UserMirror

Attachment
├── fileName
├── fileUrl
└── postId → Post
```

## Padrões de Projeto Aplicados

- **Table Mirroring:** Espelhamento local dos dados de usuário para garantir integridade referencial sem acoplamento síncrono.
- **Strategy + Registry (Upload):** O limite de upload de arquivos é calculado dinamicamente com base no `profileType` do autor. O `UploadStrategyRegistry` resolve a strategy correta em tempo de execução.
- **Dead Letter Queue (DLQ):** Mensagens que falham durante o processamento do evento `user_registered` são desviadas para a fila `community_service_queue_dlq`, prevenindo loops infinitos.
- **Pub/Sub (RabbitMQ):** A fila `community_service_queue` é vinculada à Exchange `user.events` (fanout), recebendo uma cópia de cada evento publicado.

## Evento Consumido: `user_registered`

O serviço escuta a fila `community_service_queue` e processa o seguinte payload:

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

> **Atenção:** O campo `profileType` é sempre em **minúsculas** (`student` ou `professor`).

## Micro-Frontend Servido

| Componente | Arquivo | Tag HTML | Descrição |
|------------|---------|----------|-----------|
| Comunidade / Feed | `community-element.js` | `<community-element>` | Interface completa de comunidades com feed, sidebar, criação de posts, likes, comentários e barra lateral de comunidades. |

## Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | String de conexão do PostgreSQL (schema `community`) | `postgresql://root:rootpassword@localhost:5432/microservices_db?schema=community` |
| `RABBITMQ_URL` | String de conexão do RabbitMQ | `amqp://guest:guest@localhost:5672` |
| `JWT_SECRET` | Chave simétrica para validação local dos tokens JWT | `minha-chave-secreta` |
| `PORT` | Porta HTTP do serviço | `3002` |

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
community-service/
├── prisma/
│   ├── migrations/             # Histórico de migrations do banco
│   └── schema.prisma           # Modelagem de dados (UserMirror, Community, Post, etc.)
├── public/
│   └── community-element.js    # MFE: Comunidade/Feed (Web Component / Lit)
├── src/
│   ├── common/
│   │   ├── factories/          # UploadStrategyRegistry (Strategy Pattern)
│   │   └── guards/             # JwtAuthGuard (validação local do token)
│   ├── communities/
│   │   ├── communities.controller.ts  # Rotas HTTP (/communities/*)
│   │   ├── communities.service.ts     # Lógica de comunidades
│   │   └── dto/                       # DTOs de validação
│   ├── posts/
│   │   ├── posts.controller.ts        # Rotas HTTP (/posts/*)
│   │   ├── posts.service.ts           # Lógica de posts, likes, comentários
│   │   └── dto/                       # DTOs de validação
│   ├── user-mirror/                   # Lógica de espelhamento de usuários
│   ├── prisma/
│   │   └── prisma.service.ts          # Serviço do Prisma ORM
│   ├── community.controller.ts        # Consumidor de eventos RabbitMQ
│   ├── app.module.ts                  # Módulo raiz (NestJS)
│   └── main.ts                        # Bootstrap HTTP + RabbitMQ (Pub/Sub + DLQ)
├── uploads/                    # Diretório de arquivos enviados
├── .env.example
├── Dockerfile
└── package.json
```

## Tecnologias

- [NestJS](https://nestjs.com/) · [Prisma](https://www.prisma.io/) · [PostgreSQL](https://www.postgresql.org/) · [RabbitMQ](https://www.rabbitmq.com/) · [Passport/JWT](https://docs.nestjs.com/security/authentication) · [Lit](https://lit.dev/) · [Multer](https://github.com/expressjs/multer)
