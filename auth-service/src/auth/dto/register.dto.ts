import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export enum AccountType {
  CLIENT = 'client',
  PROVIDER = 'provider',
}

export class RegisterDto {
  @IsEmail({}, { message: 'Forneça um e-mail válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsEnum(AccountType, {
    message: 'O tipo de conta deve ser client ou provider',
  })
  type: AccountType;

  // --------------------------------------------------------------------------
  // Campos específicos do CLIENT
  // --------------------------------------------------------------------------
  @ValidateIf((o) => o.type === AccountType.CLIENT)
  @IsString()
  @IsNotEmpty({ message: 'O CPF é obrigatório para clientes' })
  cpf?: string;

  @ValidateIf((o) => o.type === AccountType.CLIENT)
  @IsString()
  @IsNotEmpty({ message: 'O plano é obrigatório para clientes' })
  planType?: string;

  // --------------------------------------------------------------------------
  // Campos específicos do PROVIDER
  // --------------------------------------------------------------------------
  @ValidateIf((o) => o.type === AccountType.PROVIDER)
  @IsString()
  @IsNotEmpty({ message: 'O CNPJ é obrigatório para provedores' })
  cnpj?: string;

  @ValidateIf((o) => o.type === AccountType.PROVIDER)
  @IsOptional()
  @IsString()
  bio?: string;
}
