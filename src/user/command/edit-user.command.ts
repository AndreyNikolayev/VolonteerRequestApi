import { EditUserDto as EditUserDto } from '../dto/edit-user.dto';

export class EditUserCommand {
  constructor(
    public readonly id: number,
    public readonly editUserDto: EditUserDto,
  ) {}
}
