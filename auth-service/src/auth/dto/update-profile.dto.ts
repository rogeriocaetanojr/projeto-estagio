import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsOptional()
  name?: string;
}
