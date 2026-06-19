import { Controller, Get } from '@nestjs/common';
import { EducationService } from './education.service';

@Controller('courses')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  async findAll() {
    return this.educationService.findAll();
  }
}
