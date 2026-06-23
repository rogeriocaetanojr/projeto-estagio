import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StudentUploadLimitStrategy } from '../common/strategies/student-upload-limit.strategy';
import { ProfessorUploadLimitStrategy } from '../common/strategies/professor-upload-limit.strategy';
import { UploadStrategyRegistry } from '../common/factories/upload-strategy.registry';

@Module({
  imports: [PrismaModule],
  controllers: [PostsController],
  providers: [
    PostsService,
    StudentUploadLimitStrategy,
    ProfessorUploadLimitStrategy,
    UploadStrategyRegistry,
  ],
})
export class PostsModule {}
