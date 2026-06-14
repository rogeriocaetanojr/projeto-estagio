# Projeto Estágio - Microsserviços

Este repositório contém o projeto de estágio, estruturado em arquitetura de microsserviços.

## Estrutura do Projeto

A raiz do projeto contém a infraestrutura base (Docker) e as pastas dos microsserviços individuais. Atualmente o ecossistema é composto por:

- `docker-compose.yml`: Arquivo responsável por subir a infraestrutura base (PostgreSQL e RabbitMQ).
- `auth-service/`: Microsserviço de autenticação (Produtor) responsável por gerenciar credenciais e perfis. Construído com NestJS, Prisma e PostgreSQL.
- `community-service/`: Microsserviço da comunidade (Consumidor) responsável pelo Feed de postagens. Recebe eventos de forma desacoplada e aplica Table Mirroring. Construído com NestJS, Prisma e PostgreSQL.
- `EXTENSIBILIDADE.md`: Documentação técnica detalhando a arquitetura de eventos do projeto para inclusão de futuros módulos.

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/) (versão LTS recomendada)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

## Como rodar o projeto localmente

Siga os passos abaixo para configurar e executar o projeto em sua máquina:

### 1. Subindo a Infraestrutura (Banco de Dados e Mensageria)

Abra o terminal na **raiz do projeto** e execute o Docker Compose para iniciar os containers do PostgreSQL e RabbitMQ:

```bash
docker-compose up -d
```
> **Dica:** Para verificar se os serviços estão rodando corretamente, utilize o comando `docker ps`.

### 2. Configurando os Microsserviços

Para cada microsserviço (`auth-service` e `community-service`), abra um terminal distinto e execute os passos de preparação:

#### A. Autenticação (`auth-service`)
```bash
cd auth-service
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

#### B. Comunidade (`community-service`)
```bash
cd community-service
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

> **Aviso de Banco de Dados:** O `docker-compose` sobe o PostgreSQL na porta `5432`, com usuário `root` e senha `rootpassword`. O `schema` é parametrizado nos arquivos `.env` para garantir o isolamento lógico das tabelas de cada microsserviço dentro do mesmo banco físico.

A aplicação agora estará em execução de forma integrada! A API do `auth-service` roda na porta HTTP 3001 e a do `community-service` roda na porta HTTP 3002. Testes de API podem ser executados usando o arquivo `api-tests.http` na raiz do projeto.

## Padrões de Projeto & Arquitetura

Para atender aos requisitos de extensibilidade, modularidade e resiliência exigidos, o projeto aplica os seguintes conceitos de Engenharia de Software:

- **Pub/Sub (Publish/Subscribe):** Arquitetura orientada a eventos onde o produtor envia mensagens para uma Exchange `fanout` do RabbitMQ sem saber quem as consumirá. O desacoplamento permite plugar novos microsserviços instantaneamente.
- **Dead Letter Queue (DLQ) e Resiliência:** Prevenção de perda de dados e tolerância a falhas (ex: indisponibilidade do banco). Mensagens que geram falhas catastróficas (NACK com `requeue: false`) são automaticamente desviadas para a fila `user.events.dlx` de quarentena, prevenindo loops infinitos.
- **Table Mirroring (Espelhamento de Dados):** O `community-service` salva uma versão leve (espelho) do usuário assim que intercepta o evento assíncrono de criação, garantindo que o módulo de postagens possua integridade referencial local para alta performance no feed sem precisar consultar o `auth-service` de forma síncrona.
- **Class Table Inheritance (Herança de Dados):** Modelagem de banco de dados mapeando a entidade base `User` em relacionamento `1:1` com as entidades filhas `Student` e `Professor`, unificando o domínio.
- **JSON Field Storage:** Armazenamento semiestruturado em coluna nativa `jsonb` para gerenciar as configurações dinâmicas de perfil sem necessidade de alterações no schema físico do banco.
- **Design Patterns (Strategy & Registry):** Lógica de cálculo dinâmico de limites isolada através do padrão *Strategy* e resolvida em tempo de execução via *Registry*, blindando o núcleo do sistema.

## Tecnologias Utilizadas

- **[NestJS](https://nestjs.com/)** - Framework Node.js para o backend
- **[Prisma ORM](https://www.prisma.io/)** - ORM para o banco de dados
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[RabbitMQ](https://www.rabbitmq.com/)** - Message Broker para comunicação assíncrona
- **[Docker](https://www.docker.com/)** - Containerização da infraestrutura
