import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateCommunityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isLocked?: boolean;

  @ValidateIf((o) => o.isLocked === true)
  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória se a comunidade for trancada' })
  password?: string;

  @IsString()
  @IsNotEmpty()
  ownerId: string;
}
