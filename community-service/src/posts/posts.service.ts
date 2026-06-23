import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostsDto } from './dto/get-posts.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const { title, content, authorId, communityId } = createPostDto;

    const authorExists = await this.prisma.userMirror.findUnique({
      where: { id: authorId },
    });

    if (!authorExists) {
      throw new NotFoundException('Autor não encontrado');
    }

    if (communityId) {
      const communityExists = await this.prisma.community.findUnique({
        where: { id: communityId },
      });

      if (!communityExists) {
        throw new NotFoundException('Comunidade não encontrada');
      }
    }

    return this.prisma.post.create({
      data: {
        title,
        content,
        authorId,
        communityId,
      },
    });
  }

  findAll(query: GetPostsDto) {
    const { profileType, communityId } = query;

    return this.prisma.post.findMany({
      where: {
        ...(profileType && {
          author: {
            profileType,
          },
        }),
        ...(communityId && {
          communityId,
        }),
      },
      include: {
        author: true,
        attachments: true,
        _count: {
          select: { likes: true, comments: true },
        },
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
        _count: {
          select: { likes: true },
        },
        comments: {
          where: { parentId: null },
          include: {
            author: true,
            replies: {
              include: {
                author: true,
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
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

  async toggleLike(postId: string, userId: string) {
    await this.findOne(postId);

    const existingLike = await this.prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      await this.prisma.like.delete({
        where: { id: existingLike.id },
      });
      return { message: 'Curtida removida com sucesso', liked: false };
    }

    await this.prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
    return { message: 'Curtida adicionada com sucesso', liked: true };
  }

  async addComment(
    postId: string,
    authorId: string,
    content: string,
    parentId?: string,
  ) {
    await this.findOne(postId);

    const authorExists = await this.prisma.userMirror.findUnique({
      where: { id: authorId },
    });

    if (!authorExists) {
      throw new NotFoundException('Autor não encontrado');
    }

    if (parentId) {
      const parentExists = await this.prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentExists) {
        throw new NotFoundException('Comentário original não encontrado');
      }
    }

    return this.prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
        parentId,
      },
      include: {
        author: true,
      },
    });
  }

  async removeComment(commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comentário não encontrado');
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return { message: 'Comentário removido com sucesso' };
  }
}
