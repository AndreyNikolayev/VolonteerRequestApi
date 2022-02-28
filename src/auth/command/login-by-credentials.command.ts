export class LoginByCredentialsCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
