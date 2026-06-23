import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostsDto } from './dto/get-posts.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ToggleLikeDto } from './dto/toggle-like.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { UploadStrategyRegistry } from '../common/factories/upload-strategy.registry';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly uploadRegistry: UploadStrategyRegistry,
  ) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(@Query() query: GetPostsDto) {
    return this.postsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  @Post(':id/attachments')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads';
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadAttachment(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    const post = await this.postsService.findOne(id);
    const profileType = post.author?.profileType;

    if (!profileType) {
      // Remove o arquivo pois foi salvo antes da validação
      fs.unlinkSync(file.path);
      throw new BadRequestException(
        'Não foi possível determinar o perfil do autor do post',
      );
    }

    const strategy = this.uploadRegistry.getStrategy(profileType);
    const limitInBytes = strategy.getLimitInBytes();

    if (file.size > limitInBytes) {
      fs.unlinkSync(file.path);
      throw new BadRequestException(
        `O arquivo excede o limite de upload para o perfil ${profileType} (${limitInBytes / 1024 / 1024}MB)`,
      );
    }

    const fileUrl = `/uploads/${file.filename}`;

    const attachment = await this.postsService.addAttachment(
      id,
      file.originalname,
      fileUrl,
    );

    return attachment;
  }

  @Post(':id/likes')
  toggleLike(@Param('id') id: string, @Body() toggleLikeDto: ToggleLikeDto) {
    return this.postsService.toggleLike(id, toggleLikeDto.userId);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postsService.addComment(
      id,
      createCommentDto.authorId,
      createCommentDto.content,
      createCommentDto.parentId,
    );
  }

  @Patch(':id/comments/:commentId')
  updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.postsService.updateComment(commentId, updateCommentDto.content);
  }

  @Delete(':id/comments/:commentId')
  removeComment(@Param('commentId') commentId: string) {
    return this.postsService.removeComment(commentId);
  }
}
