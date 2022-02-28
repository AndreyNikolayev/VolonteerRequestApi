import { BadRequestException } from '@nestjs/common';
import { InviteClientEmailSender } from '../../service/invite-client-email-sender';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InviteClientCommand } from '../../command/invite-client.command';
import { UserRepository } from 'src/user/repository/user.repository';
import { User } from 'src/user/entity/user';
import { Role } from 'src/user/enum/role';

@CommandHandler(InviteClientCommand)
export class InviteClientCommandHandler
  implements ICommandHandler<InviteClientCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly inviteClientEmailSender: InviteClientEmailSender,
  ) {}

  async execute(command: InviteClientCommand): Promise<void> {
    const { email, isAdmin } = command;
    const client = await this.userRepository.findByEmail(email);

    if (client !== undefined) {
      throw new BadRequestException(`User with this email already exists.`);
    }

    const password = Math.random().toString(36).slice(-8);

    const user = new User(isAdmin ? Role.ADMIN : Role.CLIENT, email, password);

    await this.userRepository.save(user);

    await this.inviteClientEmailSender.send(email, password);
  }
}
