export class InviteClientCommand {
  constructor(
    public readonly email: string,
    public readonly isAdmin: boolean,
  ) {}
}
