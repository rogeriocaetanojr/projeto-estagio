import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createCourse(data: { name: string; description?: string; professorId?: string }) {
    if (data.professorId) {
      const professor = await this.prisma.userMirror.findUnique({
        where: { id: data.professorId },
      });

      if (!professor) {
        throw new NotFoundException('Professor não encontrado.');
      }

      if (professor.profileType.toUpperCase() !== 'PROFESSOR') {
        throw new BadRequestException('O usuário associado precisa ser um Professor.');
      }
    }

    return this.prisma.course.create({
      data: {
        name: data.name,
        description: data.description,
        professorId: data.professorId,
      },
      include: {
        professor: true,
      },
    });
  }

  async enrollStudent(courseId: string, studentId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado.');
    }

    const student = await this.prisma.userMirror.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Estudante não encontrado.');
    }

    if (student.profileType.toUpperCase() !== 'STUDENT') {
      throw new BadRequestException('Apenas estudantes podem se matricular em cursos.');
    }

    // Check if already enrolled
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('Estudante já está matriculado neste curso.');
    }

    return this.prisma.enrollment.create({
      data: {
        studentId,
        courseId,
      },
      include: {
        student: true,
        course: true,
      },
    });
  }

  async listCourses() {
    return this.prisma.course.findMany({
      include: {
        professor: true,
        _count: {
          select: { enrollments: true },
        },
      },
    });
  }

  async getCourseDetails(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        professor: true,
        enrollments: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado.');
    }

    return course;
  }

  async updateGrade(courseId: string, studentId: string, grade: number) {
    if (grade < 0 || grade > 10) {
      throw new BadRequestException('A nota deve ser um valor entre 0 e 10.');
    }

    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Matrícula não encontrada para este estudante e curso.');
    }

    return this.prisma.enrollment.update({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
      data: {
        grade,
      },
      include: {
        student: true,
        course: true,
      },
    });
  }
}
