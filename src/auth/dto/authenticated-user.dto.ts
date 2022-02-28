import { Role } from '../../user/enum/role';

export class AuthenticatedUserDto {
  constructor(public readonly id: number, public readonly role: Role) {}

  isAdmin(): boolean {
    return this.role === Role.ADMIN;
  }

  isClient(): boolean {
    return this.role === Role.CLIENT;
  }
}
