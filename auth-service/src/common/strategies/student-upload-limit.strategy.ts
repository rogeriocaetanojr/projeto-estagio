import { Injectable } from '@nestjs/common';
import { UploadLimitStrategy } from './upload-limit.strategy';

@Injectable()
export class StudentUploadLimitStrategy implements UploadLimitStrategy {
  getLimitInBytes(): number {
    return 50 * 1024 * 1024; // 50MB
  }
}
