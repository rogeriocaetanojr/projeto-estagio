import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserMirrorModule } from './user-mirror/user-mirror.module';
import { PostsModule } from './posts/posts.module';
import { CommunityController } from './community.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserMirrorModule,
    PostsModule,
  ],
  controllers: [CommunityController],
  providers: [],
})
export class AppModule {}
