import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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

  remove(id: string) {
    return `This action removes a #${id} community`;
  }
}
