import { IsOptional, IsString, IsIn } from 'class-validator';

export class GetPostsDto {
  @IsOptional()
  @IsString()
  @IsIn(['student', 'professor'], {
    message: 'profileType deve ser "student" ou "professor"',
  })
  profileType?: string;

  @IsOptional()
  @IsString()
  communityId?: string;
}
