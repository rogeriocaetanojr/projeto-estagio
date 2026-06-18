import { Injectable } from '@nestjs/common';
import { UploadLimitStrategy } from './upload-limit.strategy';

@Injectable()
export class ProfessorUploadLimitStrategy implements UploadLimitStrategy {
  getLimitInBytes(): number {
    return 500 * 1024 * 1024; // 500MB
  }
}
