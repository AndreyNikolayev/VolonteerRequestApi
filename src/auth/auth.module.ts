import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { UserRepository } from '../user/repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy } from './service/jwt.auth-strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { LoginByCredentialsCommandHandler } from './handler/command/login-by-credentials-command.handler';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guard/roles.guard';
import { AuthService } from './service/auth.service';
import { JwtRefreshStrategy } from './service/jwt.refresh-token-strategy';
import { RefreshTokenCommandHandler } from './handler/command/refresh-token-command.handler';

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return { secret: configService.get('JWT_SECRET') };
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [
    LoginByCredentialsCommandHandler,
    RefreshTokenCommandHandler,
    JwtAuthStrategy,
    JwtRefreshStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
