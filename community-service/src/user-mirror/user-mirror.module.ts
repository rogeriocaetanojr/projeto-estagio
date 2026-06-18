import { Module } from '@nestjs/common';
import { UserConsumerController } from './user-consumer.controller';
import { UserMirrorService } from './user-mirror.service';

@Module({
  controllers: [UserConsumerController],
  providers: [UserMirrorService],
  exports: [UserMirrorService],
})
export class UserMirrorModule {}
