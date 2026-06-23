import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostsDto } from './dto/get-posts.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const { title, content, authorId } = createPostDto;

    const authorExists = await this.prisma.userMirror.findUnique({
      where: { id: authorId },
    });

    if (!authorExists) {
      throw new NotFoundException('Autor não encontrado na comunidade');
    }

    return this.prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: { id: authorId },
        },
      },
    });
  }

  findAll(query: GetPostsDto) {
    const { profileType } = query;

    return this.prisma.post.findMany({
      where: {
        ...(profileType && {
          author: {
            profileType,
          },
        }),
      },
      include: {
        author: true,
        attachments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        attachments: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Postagem não encontrada');
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    await this.findOne(id);

    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.post.delete({
      where: { id },
    });

    return { message: 'Postagem removida com sucesso' };
  }

  async addAttachment(postId: string, fileName: string, fileUrl: string) {
    await this.findOne(postId);

    return this.prisma.attachment.create({
      data: {
        fileName,
        fileUrl,
        postId,
      },
    });
  }
}
