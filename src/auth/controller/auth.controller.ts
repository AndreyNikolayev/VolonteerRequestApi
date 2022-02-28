import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LoginByCredentialsDto } from '../dto/login-by-credentials.dto';
import { CommandBus } from '@nestjs/cqrs';
import { LoginByCredentialsCommand } from '../command/login-by-credentials.command';
import { RefreshGuard } from '../guard/refresh.guard';
import { RefreshTokenCommand } from '../command/refresh-token.command';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  login(@Body() dto: LoginByCredentialsDto): Promise<any> {
    return this.commandBus.execute(
      new LoginByCredentialsCommand(dto.email, dto.password),
    );
  }

  @Post('refresh')
  @UseGuards(RefreshGuard)
  refresh(@Request() request): Promise<any> {
    return this.commandBus.execute(new RefreshTokenCommand(request.user.id));
  }
}
