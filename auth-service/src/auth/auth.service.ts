import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, AccountType } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

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
          // Condicionalmente preenche 'client' ou 'provider' com base no tipo
          ...(dto.type === AccountType.CLIENT && {
            client: {
              create: {
                cpf: dto.cpf,
                planType: dto.planType,
              },
            },
          }),
          ...(dto.type === AccountType.PROVIDER && {
            provider: {
              create: {
                cnpj: dto.cnpj,
                bio: dto.bio || null,
              },
            },
          }),
        },
        // Retorna o subdocumento incluído para confirmarmos a criação completa
        include: {
          client: true,
          provider: true,
        },
      });

      // Remove a senha do objeto de retorno para maior segurança
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    } catch (error) {
      // Em casos de violação de Unique Key (ex: CPF ou CNPJ duplicado) que o prisma levanta (P2002)
      if (error.code === 'P2002') {
         throw new ConflictException('Dados únicos já registrados (CPF ou CNPJ).');
      }
      throw new InternalServerErrorException('Erro interno ao registrar usuário');
    }
  }
}

