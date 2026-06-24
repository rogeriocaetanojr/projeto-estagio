import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface UserRegisteredPayload {
  id: string;
  email: string;
  profileType: string;
}

@Injectable()
export class UserMirrorService {
  private readonly logger = new Logger(UserMirrorService.name);

  constructor(private readonly prisma: PrismaService) {}

  async upsertUser(data: UserRegisteredPayload) {
    try {
      this.logger.log(
        `Processando upsert para o usuário mirror: ${data.email} (${data.id})`,
      );
      const user = await this.prisma.userMirror.upsert({
        where: { id: data.id },
        update: {
          email: data.email,
          profileType: data.profileType,
        },
        create: {
          id: data.id,
          email: data.email,
          profileType: data.profileType,
        },
      });
      this.logger.log(`Usuário mirror persistido com sucesso: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Erro ao salvar usuário mirror no banco:`, error);
      throw error;
    }
  }

  async updateUserName(userId: string, name: string) {
    try {
      this.logger.log(
        `Processando atualização de nome para o usuário mirror: ${userId} -> ${name}`,
      );
      const user = await this.prisma.userMirror.update({
        where: { id: userId },
        data: {
          name: name,
        },
      });
      this.logger.log(`Nome do usuário mirror atualizado com sucesso: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Erro ao atualizar nome do usuário mirror no banco:`, error);
      throw error;
    }
  }
}
