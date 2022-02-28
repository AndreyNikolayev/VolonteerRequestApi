export class Result<T> {
  public readonly value: T;
  public readonly errors: string[];

  public get isSuccess(): boolean {
    return !this.errors;
  }

  private constructor(value: T, errors: string[]) {
    this.value = value;
    this.errors = errors;
  }

  static Success<T>(value: T) {
    return new Result<T>(value, null);
  }

  static Error(errors: string[]) {
    return new Result(null, errors);
  }
}
