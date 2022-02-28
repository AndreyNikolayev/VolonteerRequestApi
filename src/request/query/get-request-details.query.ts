import { NotFoundException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { UserRepository } from 'src/user/repository/user.repository';
import { RequestRepository } from '../repository/request.repository';

export class GetRequestDetailsQuery {
  constructor(public readonly id: number) {}
}

@QueryHandler(GetRequestDetailsQuery)
export class GetRequestDetailsQueryHandler
  implements IQueryHandler<GetRequestDetailsQuery>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly requestRepository: RequestRepository,
  ) {}

  async execute(command: GetRequestDetailsQuery): Promise<any> {
    const request = await this.requestRepository.findOne(command.id, {
      relations: ['user'],
    });

    const user = request.user;

    request.user = null;

    if (!request) {
      throw new NotFoundException(
        `Request with id: ${command.id} is not found`,
      );
    }

    return {
      ...request,
      userSocialLink: user.socialLink,
      userEmail: user.email,
      userPhone: user.phone,
      userName: user.name,
    };
  }
}
