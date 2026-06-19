import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaService } from './prisma/prisma.service';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'public'),
            serveRoot: '/app-bundle',
        }),
    ],
    controllers: [EducationController],
    providers: [PrismaService, EducationService],
})
export class AppModule { }