import { User } from '../entity/user';

export class UserDetailsDto {
  id: number;
  name: string;
  email: string;
  socialLink: string;
  phone: string;

  static fromUser(user: User): UserDetailsDto {
    const clientDetailsDto = new UserDetailsDto();
    clientDetailsDto.id = user.id;
    clientDetailsDto.name = user.name;
    clientDetailsDto.email = user.email;
    clientDetailsDto.socialLink = user.socialLink;
    clientDetailsDto.phone = user.phone;

    return clientDetailsDto;
  }
}
