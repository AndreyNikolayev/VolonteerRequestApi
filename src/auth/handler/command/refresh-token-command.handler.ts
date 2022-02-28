import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../../user/repository/user.repository';
import { AuthService } from 'src/auth/service/auth.service';
import { RefreshTokenCommand } from 'src/auth/command/refresh-token.command';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(
    command: RefreshTokenCommand,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userRepository.findOne(command.userId);

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      access_token: await this.authService.getAccessToken(user),
      refresh_token: await this.authService.getRefreshToken(user),
    };
  }
}
