import { Controller, Get, Post, Patch, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsNumber, Min, Max } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do curso é obrigatório.' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID(4, { message: 'O ID do professor deve ser um UUID válido.' })
  @IsOptional()
  professorId?: string;
}

export class EnrollStudentDto {
  @IsUUID(4, { message: 'O ID do estudante deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O ID do estudante é obrigatório.' })
  studentId: string;
}

export class UpdateGradeDto {
  @IsNumber({}, { message: 'A nota deve ser um número.' })
  @Min(0, { message: 'A nota mínima é 0.' })
  @Max(10, { message: 'A nota máxima é 10.' })
  @IsNotEmpty({ message: 'A nota é obrigatória.' })
  grade: number;
}

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.createCourse(createCourseDto);
  }

  @Get()
  findAll() {
    return this.coursesService.listCourses();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.getCourseDetails(id);
  }

  @Post(':id/enroll')
  enroll(
    @Param('id', ParseUUIDPipe) courseId: string,
    @Body() enrollStudentDto: EnrollStudentDto,
  ) {
    return this.coursesService.enrollStudent(courseId, enrollStudentDto.studentId);
  }

  @Patch(':id/enrollments/:studentId')
  updateGrade(
    @Param('id', ParseUUIDPipe) courseId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body() updateGradeDto: UpdateGradeDto,
  ) {
    return this.coursesService.updateGrade(courseId, studentId, updateGradeDto.grade);
  }
}
