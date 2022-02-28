import { NotFoundException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { UserDetailsDto } from '../dto/client-details.dto';
import { UserRepository } from '../repository/user.repository';

export class GetUserDetailsQuery {
  constructor(public readonly id: number) {}
}

@QueryHandler(GetUserDetailsQuery)
export class GetClientDetailsQueryHandler
  implements IQueryHandler<GetUserDetailsQuery>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: GetUserDetailsQuery): Promise<UserDetailsDto> {
    const user = await this.userRepository.findOne(command.id);

    if (!user) {
      throw new NotFoundException(`User with id: ${command.id} is not found`);
    }

    return UserDetailsDto.fromUser(user);
  }
}
