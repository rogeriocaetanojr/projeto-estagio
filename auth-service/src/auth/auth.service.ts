import { Injectable, ConflictException, InternalServerErrorException, Inject, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, AccountType } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('MESSAGE_BROKER') private readonly client: ClientProxy,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Verifica se o usuário já existe pelo e-mail
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('E-mail já está em uso.');
    }

    // 2. Criptografa a senha com salt rounds = 10
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Define as configurações iniciais (padrão JSON field)
    const initialSettings = { theme: 'system', notifications: true };

    try {
      // 4. Executa a criação aninhada e transacional através do Prisma
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          settings: initialSettings,
          // Condicionalmente preenche 'student' ou 'professor' com base no tipo
          ...(dto.type === AccountType.STUDENT && {
            student: {
              create: {
                ra: dto.ra!,
                periodo: dto.periodo!,
              },
            },
          }),
          ...(dto.type === AccountType.PROFESSOR && {
            professor: {
              create: {
                matricula: dto.matricula!,
                titulacao: dto.titulacao!,
              },
            },
          }),
        },
        // Retorna o subdocumento incluído para confirmarmos a criação completa
        include: {
          student: true,
          professor: true,
        },
      });

      // Remove a senha do objeto de retorno para maior segurança
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      // Emite o evento de usuário registrado para o RabbitMQ
      this.logger.log(`Emitindo evento 'user_registered' para RabbitMQ...`);
      await lastValueFrom(
        this.client.emit('user_registered', {
          id: result.id,
          email: result.email,
          profileType: dto.type,
        }),
      );
      this.logger.log(`Evento emitido com sucesso!`);

      return result;
    } catch (error) {
      // Em casos de violação de Unique Key (ex: RA ou Matrícula duplicados) que o prisma levanta (P2002)
      if (error.code === 'P2002') {
         throw new ConflictException('Dados únicos já registrados (RA ou Matrícula).');
      }
      this.logger.error(`Erro no registro:`, error);
      throw new InternalServerErrorException('Erro interno ao registrar usuário');
    }
  }
}

