import { FilterCondition } from '../enum/filter-condition.enum';

export class FieldFilterConditionDto {
  constructor(
    public readonly conditionType: FilterCondition,
    public readonly value: any,
  ) {}
}
