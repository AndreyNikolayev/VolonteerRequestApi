import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Role } from 'src/user/enum/role';
import { UserRepository } from 'src/user/repository/user.repository';
import { RequestStatus } from '../enum/request-status';
import { RequestRepository } from '../repository/request.repository';

export class CloseRequestCommand {
  constructor(public readonly id: number, public readonly userId: number) {}
}

@CommandHandler(CloseRequestCommand)
export class CloseRequestCommandHandler
  implements ICommandHandler<CloseRequestCommand>
{
  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CloseRequestCommand): Promise<void> {
    const user = await this.userRepository.findOne(command.userId);

    const request = await this.requestRepository.findOne(command.id, {
      relations: ['user'],
    });

    if (request.user.id !== user.id && user.role !== Role.ADMIN) {
      throw new BadRequestException('You cannot perform this action');
    }

    request.status = RequestStatus.Closed;

    await this.requestRepository.save(request);
  }
}
