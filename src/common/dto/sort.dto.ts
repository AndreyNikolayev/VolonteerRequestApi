export class SortDto {
  constructor(
    public readonly field: string,
    public readonly direction: 'ASC' | 'DESC',
  ) {}
}
