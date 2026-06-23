import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class JoinCommunityDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  password?: string;
}
