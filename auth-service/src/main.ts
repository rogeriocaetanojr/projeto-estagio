import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para o front-end (main-shell) acessar as APIs
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Configuração global de validação dos dados de entrada (DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove campos que não possuem decoradores no DTO
      transform: true, // Transforma os tipos primitivos automaticamente nos DTOs
      forbidNonWhitelisted: true, // Retorna erro HTTP 400 se campos não permitidos forem enviados
    }),
  );

  // Recupera o serviço de configuração
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3001;

  await app.listen(port);
  logger.log(`Serviço de Autenticação (auth-service) rodando na porta ${port}`);
}
bootstrap();

