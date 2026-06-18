import { Module } from '@nestjs/common';
import { UserMirrorService } from './user-mirror.service';
import { UserConsumerController } from './user-consumer.controller';

@Module({
  providers: [UserMirrorService],
  controllers: [UserConsumerController],
  exports: [UserMirrorService],
})
export class UserMirrorModule {}
