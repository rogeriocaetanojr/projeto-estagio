# Projeto Estágio - Microsserviços

Este repositório contém o projeto de estágio, estruturado em arquitetura de microsserviços.

##  Estrutura do Projeto

A raiz do projeto contém a infraestrutura base (Docker) e as pastas dos microsserviços individuais. Atualmente, temos o serviço de autenticação (`auth-service`).

- `docker-compose.yml`: Arquivo responsável por subir a infraestrutura base (PostgreSQL e RabbitMQ).
- `auth-service/`: Microsserviço de autenticação construído com NestJS, Prisma e PostgreSQL.

##  Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em sua máquina:
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/) (versão LTS recomendada)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

##  Como rodar o projeto localmente

Siga os passos abaixo para configurar e executar o projeto em sua máquina:

### 1. Subindo a Infraestrutura (Banco de Dados e Mensageria)

Abra o terminal na **raiz do projeto** e execute o Docker Compose para iniciar os containers do PostgreSQL e RabbitMQ:

```bash
docker-compose up -d
```
> **Dica:** Para verificar se os serviços estão rodando corretamente, utilize o comando `docker ps`.

### 2. Configurando o Serviço de Autenticação (`auth-service`)

Navegue até a pasta do microsserviço de autenticação:

```bash
cd auth-service
```

#### Instalação das dependências

```bash
npm install
```

#### Variáveis de Ambiente

Crie o arquivo de variáveis de ambiente (`.env`) baseado no arquivo de exemplo (`.env.example`).
Se estiver no Windows, você pode simplesmente copiar o arquivo `.env.example` e renomeá-lo para `.env`, ou rodar o comando:

```bash
cp .env.example .env
```
> O `docker-compose` está configurado para subir o banco na porta `5432`, com usuário `root` e senha `rootpassword`. O banco de dados padrão é `microservices_db`. Certifique-se de que a `DATABASE_URL` no seu `.env` esteja apontando corretamente para essas credenciais.

#### Banco de Dados (Prisma ORM)

Com o banco de dados rodando (passo 1) e o `.env` configurado, gere o Prisma Client e aplique as migrações no banco:

```bash
npx prisma generate
npx prisma migrate dev
```

### 3. Executando a aplicação

Ainda dentro da pasta `auth-service`, inicie o servidor em modo de desenvolvimento (com auto-reload):

```bash
npm run start:dev
```

A aplicação agora estará em execução!

##  Padrões de Projeto & Arquitetura

Para atender aos requisitos de extensibilidade, modularidade e resiliência exigidos, o projeto aplica os seguintes conceitos de Engenharia de Software:

- **Class Table Inheritance (Herança de Dados):** Modelagem de banco de dados mapeando a entidade base `User` em relacionamento `1:1` com as entidades filhas `Student` e `Professor`, unificando o domínio.
- **JSON Field Storage:** Armazenamento semiestruturado em coluna nativa `jsonb` para gerenciar as configurações dinâmicas de perfil (`settings`) sem necessidade de constantes alterações no schema físico do banco.
- **Design Patterns (Strategy & Registry):** Lógica de cálculo dinâmico de limites de upload isolada através do padrão *Strategy* e resolvida em tempo de execução de forma totalmente desacoplada via *Registry*, blindando o núcleo do sistema contra acoplamento rígido.
- **Mensageria Orientada a Eventos:** Produtor de eventos integrado através de protocolo AMQP com o RabbitMQ, garantindo o disparo assíncrono do evento `user_registered` para os demais microsserviços do ecossistema.

##  Tecnologias Utilizadas

- **[NestJS](https://nestjs.com/)** - Framework Node.js para o backend
- **[Prisma ORM](https://www.prisma.io/)** - ORM para o banco de dados
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[RabbitMQ](https://www.rabbitmq.com/)** - Message Broker para comunicação assíncrona
- **[Docker](https://www.docker.com/)** - Containerização dos serviços
