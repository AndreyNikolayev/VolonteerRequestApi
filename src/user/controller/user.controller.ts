import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from '../enum/role';
import { InviteClientCommand } from '../command/invite-client.command';
import { InviteRequestDto } from '../dto/invite-request.dto';
import { EditUserDto } from '../dto/edit-user.dto';
import { SelfOrAdmin } from 'src/auth/decorator/self-or-admin.decorator';
import { EditUserCommand } from '../command/edit-user.command';
import { GetUserDetailsQuery } from '../query/get-client-details.query';

@Controller('users')
export class UserController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Roles(Role.ADMIN)
  @Post('invite')
  async send(@Body() inviteRequest: InviteRequestDto) {
    await this.commandBus.execute(
      new InviteClientCommand(inviteRequest.email, inviteRequest.isAdmin),
    );
  }

  @SelfOrAdmin()
  @Post(':id')
  async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() editUserDto: EditUserDto,
  ) {
    await this.commandBus.execute(new EditUserCommand(id, editUserDto));
  }

  @SelfOrAdmin()
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return await this.queryBus.execute(new GetUserDetailsQuery(id));
  }
}
