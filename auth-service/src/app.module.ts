import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna o módulo de configuração global em toda a aplicação
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

