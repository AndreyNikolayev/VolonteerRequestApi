import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from 'src/user/repository/user.repository';
import { Request } from '../entity/request';
import { RequestStatus } from '../enum/request-status';
import { RequestRepository } from '../repository/request.repository';

export class CreateRequestCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly unit: string,
    public readonly requested: number,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateRequestCommand)
export class CreateRequestCommandHandler
  implements ICommandHandler<CreateRequestCommand>
{
  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateRequestCommand): Promise<void> {
    const user = await this.userRepository.findOne(command.userId);

    const request = new Request(
      command.name,
      command.description,
      command.unit,
      command.requested,
      0,
      user,
      RequestStatus.Open,
    );

    await this.requestRepository.save(request);
  }
}
