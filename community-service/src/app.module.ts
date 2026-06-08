import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserMirrorModule } from './user-mirror/user-mirror.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserMirrorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
