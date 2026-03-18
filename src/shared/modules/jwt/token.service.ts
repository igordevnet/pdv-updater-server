import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GenerateTokenDTO } from 'src/core/auth/dtos/generate-token.dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async generateAccessToken(dto: GenerateTokenDTO): Promise<string> {
    const atSecret = this.configService.get<string>('AT_KEY');

    if (!atSecret) {
      throw new Error('Invalid atSecret env variable');
    }

    return this.jwtService.signAsync(
      {
        sub: dto.userId,
        device: dto.deviceId,
        name: dto.name,
      },
      {
        expiresIn: 60 * 15,
        secret: process.env.AT_KEY,
      },
    );
  }

  async generateRefreshToken(): Promise<string> {
    return crypto.randomBytes(32).toString('hex');
  }
}