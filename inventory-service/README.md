# Módulo de Gestão de Insumos (Inventory Service)

**Responsáveis pelo Desenvolvimento:** Ytallo e Carlos Ribeiro

## Diretrizes Gerais
Este módulo é parte integrante da arquitetura de microsserviços do projeto. O desenvolvimento deste serviço é agnóstico a linguagens de programação e frameworks; a implementação pode ser realizada em qualquer tecnologia (como Node.js, Python, Java, Go, C#, entre outras), desde que sejam respeitados os contratos de infraestrutura, comunicação em rede e mensageria definidos a seguir.

---

## 1. Configuração de Rede no Docker
Para possibilitar a comunicação com a infraestrutura principal do projeto e com o Message Broker, o container deste serviço deve obrigatoriamente executar na mesma rede virtual. 

Configure o arquivo `docker-compose.yml` do serviço associando-o à rede externa `microservices_network`:

```yaml
services:
  inventory-service:
    build: .
    # Outras configurações específicas do serviço
    networks:
      - microservices_network

networks:
  microservices_network:
    external: true
```

---

## 2. Conexão com o Message Broker (RabbitMQ)
Toda a comunicação assíncrona baseada em eventos é intermediada pelo RabbitMQ. Seguem os dados para estabelecimento de conexão no ambiente local:

- **Host:** `rabbitmq` (utilizar `localhost` caso o serviço seja executado fora do container Docker e a porta esteja mapeada para a máquina hospedeira)
- **Porta:** `5672`
- **Usuário:** `root`
- **Senha:** `rootpassword`

**String de Conexão padrão (AMQP):**
`amqp://root:rootpassword@rabbitmq:5672`

---

## 3. Contrato de Mensagens: Evento `user_registered`
O microsserviço de autenticação (`auth-service`) publica um evento sempre que um novo usuário (Student ou Professor) é inserido na base de dados. 

O contrato de comunicação segue o padrão de envelopamento do framework NestJS. O serviço deve escutar a fila associada ao tópico `'user_registered'` e processar o payload JSON sob a seguinte estrutura:

```json
{
  "pattern": "user_registered",
  "data": {
    "id": "uuid-identificador-do-usuario",
    "email": "usuario@dominio.com",
    "profileType": "STUDENT"
  }
}
```

### Detalhes dos Campos (Objeto `data`):
* `id` (String / UUID): Identificador único do usuário gerado pelo serviço de autenticação.
* `email` (String): Endereço de e-mail do usuário.
* `profileType` (String): Tipo de perfil do usuário. Valores possíveis: `STUDENT` ou `PROFESSOR`.

---

## 4. Diretriz de Arquitetura: Database per Service
Em conformidade com os padrões de arquitetura de microsserviços, cada serviço possui seu próprio armazenamento persistente isolado (*Database per Service*). Este módulo não deve, sob nenhuma circunstância, realizar conexões ou consultas diretas ao banco de dados do `auth-service`.

Para garantir o desacoplamento físico e manter as referências necessárias para a lógica do negócio:
1. Crie uma tabela espelho de usuários (ex: `users` ou `users_mirror`) no banco de dados local deste serviço.
2. Modele a tabela contendo apenas os campos estritamente necessários para as regras de negócio deste módulo (como o `id` e o `profileType`), definindo o `id` originário do evento como chave primária local.
3. Implemente um consumidor de mensagens para escutar o evento `user_registered` e executar operações de persistência local (inserção/atualização) com os dados recebidos.
4. Utilize a chave primária da tabela espelho como chave estrangeira em tabelas locais associadas à gestão de insumos.
