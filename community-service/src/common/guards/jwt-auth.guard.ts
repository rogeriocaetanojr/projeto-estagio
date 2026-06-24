import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não fornecido ou formato inválido');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.verifyJwt(token);
      request.user = {
        userId: payload.sub,
        email: payload.email,
        profileType: payload.profileType,
      };
      return true;
    } catch (e) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  private verifyJwt(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Formato do token inválido');
    }

    const [headerB64, payloadB64, signatureB64] = parts;
    const secret = this.configService.get<string>('JWT_SECRET') || 'meu_segredo_super_seguro_aqui';

    // Verify signature
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${headerB64}.${payloadB64}`);
    const expectedSignature = hmac
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const cleanSignature = signatureB64.replace(/=/g, '');
    if (cleanSignature !== expectedSignature) {
      throw new Error('Assinatura do token inválida');
    }

    // Decode payload
    const payloadStr = Buffer.from(payloadB64, 'base64').toString('utf8');
    const payload = JSON.parse(payloadStr);

    // Optional expiration check if exp exists
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      throw new Error('Token expirado');
    }

    return payload;
  }
}
