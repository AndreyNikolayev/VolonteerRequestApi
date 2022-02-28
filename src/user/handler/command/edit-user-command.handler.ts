import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EditUserCommand } from 'src/user/command/edit-user.command';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/user/repository/user.repository';

@CommandHandler(EditUserCommand)
export class EditUserCommandHandler
  implements ICommandHandler<EditUserCommand>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: EditUserCommand) {
    const user = await this.userRepository.findOne(command.id);

    if (!user) {
      throw new NotFoundException();
    }

    user.name = command.editUserDto.name;
    user.socialLink = command.editUserDto.socialLink;
    user.phone = command.editUserDto.phone;

    await this.userRepository.save(user);
  }
}
