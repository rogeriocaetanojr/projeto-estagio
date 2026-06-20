import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { UserMirrorModule } from './user-mirror/user-mirror.module';
import { PostsModule } from './posts/posts.module';
import { CommunityController } from './community.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/app-bundle',
    }),
    PrismaModule,
    UserMirrorModule,
    PostsModule,
  ],
  controllers: [CommunityController],
  providers: [],
})
export class AppModule {}
