import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadLimitStrategy } from '../strategies/upload-limit.strategy';
import { StudentUploadLimitStrategy } from '../strategies/student-upload-limit.strategy';
import { ProfessorUploadLimitStrategy } from '../strategies/professor-upload-limit.strategy';

@Injectable()
export class UploadStrategyRegistry {
  private readonly strategies = new Map<string, UploadLimitStrategy>();

  constructor(
    private readonly studentStrategy: StudentUploadLimitStrategy,
    private readonly professorStrategy: ProfessorUploadLimitStrategy,
  ) {
    this.strategies.set('student', this.studentStrategy);
    this.strategies.set('professor', this.professorStrategy);
  }

  getStrategy(profileType: string): UploadLimitStrategy {
    const strategy = this.strategies.get(profileType);

    if (!strategy) {
      throw new NotFoundException(
        `Nenhuma estratégia de limite de upload encontrada para o perfil: ${profileType}`,
      );
    }

    return strategy;
  }
}
