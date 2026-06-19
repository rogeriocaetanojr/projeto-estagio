import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccountType } from './dto/register.dto';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: 'MESSAGE_BROKER',
          useValue: {
            publish: jest.fn(),
          },
        },
        {
          provide: 'AUTH_RABBITMQ_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('deve lançar ConflictException quando o e-mail já existe', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', email: 'test@test.com' });

      await expect(
        service.register({ email: 'test@test.com', password: 'pass', type: AccountType.STUDENT, ra: '123', periodo: 1 })
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('deve lançar UnauthorizedException quando a senha está incorreta', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', email: 'test@test.com', password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' })
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve retornar access_token quando as credenciais são válidas', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', email: 'test@test.com', password: 'hashed', student: { ra: '123' } });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.signAsync as jest.Mock).mockResolvedValue('fake_token');

      const result = await service.login({ email: 'test@test.com', password: 'correct' });

      expect(result).toEqual({
        access_token: 'fake_token',
        user: {
          id: '1',
          email: 'test@test.com',
          profileType: 'student',
        },
      });
    });
  });
});
