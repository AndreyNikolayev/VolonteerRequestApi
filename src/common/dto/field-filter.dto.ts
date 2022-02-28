import { FieldFilterConditionDto } from './field-filter-condition.dto';

export class FieldFilterDto {
  constructor(
    public readonly field: string,
    public readonly conditions: FieldFilterConditionDto[],
  ) {}
}
