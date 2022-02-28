import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginByCredentialsCommand } from '../../command/login-by-credentials.command';
import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../../user/repository/user.repository';
import { AuthService } from 'src/auth/service/auth.service';

@CommandHandler(LoginByCredentialsCommand)
export class LoginByCredentialsCommandHandler
  implements ICommandHandler<LoginByCredentialsCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(
    command: LoginByCredentialsCommand,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userRepository.findByEmail(command.email);

    if (user === undefined) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (await user.isPasswordMatched(command.password)) {
      return {
        access_token: await this.authService.getAccessToken(user),
        refresh_token: await this.authService.getRefreshToken(user),
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }
}
