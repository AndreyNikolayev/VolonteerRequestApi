import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entity/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getAccessToken(user: User): Promise<string> {
    const payload = { sub: user.id, role: user.role };
    const expiresIn = this.configService.get<string>('JWT_TTL');
    return this.jwtService.signAsync(payload, { expiresIn });
  }

  getRefreshToken(user: User): Promise<string> {
    const payload = { sub: user.id };
    const expiresIn = this.configService.get<string>('JWT_REFRESH_TTL');
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    return this.jwtService.signAsync(payload, { secret, expiresIn });
  }
}
