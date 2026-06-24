import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  Inject,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, AccountType } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';
import type { ChannelWrapper } from 'amqp-connection-manager';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import {
  USER_EVENTS_EXCHANGE,
  ProfileType,
  UserRegisteredEvent,
} from '../events/contracts';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('MESSAGE_BROKER') private readonly messageBroker: ChannelWrapper,
    @Inject('AUTH_RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
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

      // Emite o evento de usuário registrado para a Exchange no RabbitMQ
      this.logger.log(
        `Emitindo evento 'user_registered' para a Exchange '${USER_EVENTS_EXCHANGE}'...`,
      );

      const payload: UserRegisteredEvent = {
        pattern: 'user_registered',
        data: {
          id: result.id,
          email: result.email,
          profileType: dto.type as unknown as ProfileType,
        },
      };

      await this.messageBroker.publish(
        USER_EVENTS_EXCHANGE,
        '',
        Buffer.from(JSON.stringify(payload)),
      );

      this.logger.log(`Evento emitido com sucesso na Exchange!`);

      this.publishUserLogin({ id: result.id, email: result.email });

      return result;
    } catch (error) {
      // Em casos de violação de Unique Key (ex: RA ou Matrícula duplicados) que o prisma levanta (P2002)
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Dados únicos já registrados (RA ou Matrícula).',
        );
      }
      this.logger.error(`Erro no registro:`, error);
      throw new InternalServerErrorException(
        'Erro interno ao registrar usuário',
      );
    }
  }

  async login(dto: LoginDto) {
    // Busca o User por email (include student e professor)
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        student: true,
        professor: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Compara dto.password com user.password usando bcrypt.compare
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Determina o profileType
    let profileType: string | null = null;
    if (user.student) {
      profileType = 'student';
    } else if (user.professor) {
      profileType = 'professor';
    }

    // Gera o JWT com payload { sub: user.id, email: user.email, profileType }
    const payload = { sub: user.id, email: user.email, profileType };
    const access_token = await this.jwtService.signAsync(payload);

    // Mantém a emissão do evento 'user_logged_in'
    this.publishUserLogin({ id: user.id, email: user.email });

    // Retorna { access_token, user: { id, email, profileType } }
    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        profileType,
      },
    };
  }

  publishUserLogin(userData: any) {
    this.logger.log(`Emitindo evento 'user_logged_in'...`);
    this.client.emit('user_logged_in', userData);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        professor: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
      },
    });

    this.logger.log(
      `Emitindo evento 'user_updated' para a Exchange '${USER_EVENTS_EXCHANGE}'...`,
    );

    const payload = {
      pattern: 'user_updated',
      data: {
        userId: updatedUser.id,
        name: updatedUser.name,
      },
    };

    await this.messageBroker.publish(
      USER_EVENTS_EXCHANGE,
      '',
      Buffer.from(JSON.stringify(payload)),
    );

    this.logger.log(`Evento 'user_updated' emitido com sucesso na Exchange!`);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = updatedUser;
    return result;
  }
}
