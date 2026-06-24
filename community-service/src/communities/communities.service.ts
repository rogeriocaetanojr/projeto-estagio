import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CommunitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCommunityDto: CreateCommunityDto) {
    const { name, description, isLocked, password, ownerId } = createCommunityDto;

    const ownerExists = await this.prisma.userMirror.findUnique({
      where: { id: ownerId },
    });

    if (!ownerExists) {
      throw new NotFoundException('Criador da comunidade não encontrado');
    }

    if (isLocked && !password) {
      throw new BadRequestException('Senha é obrigatória para comunidades trancadas');
    }

    let passwordHash: string | null = null;
    if (isLocked && password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const community = await this.prisma.community.create({
      data: {
        name,
        description,
        isLocked: isLocked || false,
        passwordHash,
        ownerId,
        members: {
          create: {
            userId: ownerId,
          },
        },
      },
    });

    const { passwordHash: _, ...result } = community;
    return result;
  }

  async findAll() {
    const communities = await this.prisma.community.findMany({
      include: {
        owner: true,
        members: true,
      },
    });

    return communities.map((community) => {
      const { passwordHash: _, ...result } = community;
      return result;
    });
  }

  async findOne(id: string) {
    const community = await this.prisma.community.findUnique({
      where: { id },
      include: {
        owner: true,
      },
    });

    if (!community) {
      throw new NotFoundException('Comunidade não encontrada');
    }

    const { passwordHash: _, ...result } = community;
    return result;
  }

  update(id: string, updateCommunityDto: UpdateCommunityDto) {
    return `This action updates a #${id} community`;
  }

  async remove(id: string, userId: string) {
    const community = await this.prisma.community.findUnique({
      where: { id },
    });

    if (!community) {
      throw new NotFoundException('Comunidade não encontrada');
    }

    if (community.ownerId !== userId) {
      throw new ForbiddenException('Apenas o criador da comunidade pode excluí-la');
    }

    await this.prisma.community.delete({
      where: { id },
    });

    return { message: 'Comunidade excluída com sucesso' };
  }

  async leave(id: string, userId: string) {
    const community = await this.prisma.community.findUnique({
      where: { id },
    });

    if (!community) {
      throw new NotFoundException('Comunidade não encontrada');
    }

    const existingMember = await this.prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId,
          communityId: id,
        },
      },
    });

    if (!existingMember) {
      throw new BadRequestException('Você não é membro desta comunidade');
    }

    await this.prisma.communityMember.delete({
      where: {
        userId_communityId: {
          userId,
          communityId: id,
        },
      },
    });

    return { message: 'Você saiu da comunidade com sucesso' };
  }

  async join(id: string, userId: string, password?: string) {
    const community = await this.prisma.community.findUnique({
      where: { id },
    });

    if (!community) {
      throw new NotFoundException('Comunidade não encontrada');
    }

    const userExists = await this.prisma.userMirror.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const existingMember = await this.prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId,
          communityId: id,
        },
      },
    });

    if (existingMember) {
      return { message: 'Você já é membro desta comunidade' };
    }

    if (community.isLocked) {
      if (!password) {
        throw new BadRequestException('A comunidade é trancada. Uma senha é necessária para entrar.');
      }

      const hash = community.passwordHash || '';
      const isPasswordValid = await bcrypt.compare(password, hash);
      if (!isPasswordValid) {
        throw new BadRequestException('Senha incorreta para esta comunidade.');
      }
    }

    await this.prisma.communityMember.create({
      data: {
        userId,
        communityId: id,
      },
    });

    return { message: 'Você entrou na comunidade com sucesso' };
  }
}
