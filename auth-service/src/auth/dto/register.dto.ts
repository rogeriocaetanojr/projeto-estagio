import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export enum AccountType {
  STUDENT = 'student',
  PROFESSOR = 'professor',
}

export class RegisterDto {
  @IsEmail({}, { message: 'Forneça um e-mail válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsEnum(AccountType, {
    message: 'O tipo de conta deve ser student ou professor',
  })
  type: AccountType;

  // --------------------------------------------------------------------------
  // Campos específicos do STUDENT
  // --------------------------------------------------------------------------
  @ValidateIf((o) => o.type === AccountType.STUDENT)
  @IsString()
  @IsNotEmpty({ message: 'O RA é obrigatório para estudantes' })
  ra?: string;

  @ValidateIf((o) => o.type === AccountType.STUDENT)
  @IsInt({ message: 'O período deve ser um número inteiro' })
  @IsNotEmpty({ message: 'O período é obrigatório para estudantes' })
  periodo?: number;

  // --------------------------------------------------------------------------
  // Campos específicos do PROFESSOR
  // --------------------------------------------------------------------------
  @ValidateIf((o) => o.type === AccountType.PROFESSOR)
  @IsString()
  @IsNotEmpty({ message: 'A matrícula é obrigatória para professores' })
  matricula?: string;

  @ValidateIf((o) => o.type === AccountType.PROFESSOR)
  @IsString()
  @IsNotEmpty({ message: 'A titulação é obrigatória para professores' })
  titulacao?: string;
}
