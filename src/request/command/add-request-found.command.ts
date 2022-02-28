import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Role } from 'src/user/enum/role';
import { UserRepository } from 'src/user/repository/user.repository';
import { RequestRepository } from '../repository/request.repository';

export class AddRequestFoundCommand {
  constructor(
    public readonly id: number,
    public readonly found: number,
    public readonly userId: number,
  ) {}
}

@CommandHandler(AddRequestFoundCommand)
export class AddRequestFoundCommandHandler
  implements ICommandHandler<AddRequestFoundCommand>
{
  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: AddRequestFoundCommand): Promise<void> {
    const user = await this.userRepository.findOne(command.userId);

    const request = await this.requestRepository.findOne(command.id, {
      relations: ['user'],
    });

    if (request.user.id !== user.id && user.role !== Role.ADMIN) {
      throw new BadRequestException('You cannot perform this action');
    }

    request.found += command.found;

    await this.requestRepository.save(request);
  }
}
