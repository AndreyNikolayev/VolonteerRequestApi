import { SelectQueryBuilder } from 'typeorm';
import { FieldFilterDto } from '../dto/field-filter.dto';
import { SortDto } from '../dto/sort.dto';
import { FilterCondition } from '../enum/filter-condition.enum';
import { PageDto } from '../dto/page.dto';

declare module 'typeorm' {
  export interface SelectQueryBuilder<Entity> {
    applySearchQuery(
      dbAlias: string,
      sort: SortDto[],
      filter?: FieldFilterDto[],
      page?: PageDto,
    ): SelectQueryBuilder<Entity>;
  }
}

const camelToSnakeCase = (str: string): string =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const conditionTypeToOperation = (conditionType: FilterCondition): string => {
  switch (conditionType) {
    case FilterCondition.Equal:
      return '=';
    case FilterCondition.Greater:
      return '>';
    case FilterCondition.GreaterOrEqual:
      return '=>';
    case FilterCondition.Less:
      return '<';
    case FilterCondition.LessOrEqual:
      return '<=';
    case FilterCondition.In:
      return 'IN';
    case FilterCondition.Like:
      return 'LIKE';
    default:
      throw new Error('Invalid Filter Condition');
  }
};

const valueToSql = (parameterName: string, value: any): string => {
  if (Array.isArray(value)) {
    return `(:...${parameterName})`;
  }
  return `:${parameterName}`;
};

const buildWhereParameters = (
  dbAlias: string,
  filter: FieldFilterDto[],
): any[] => {
  return filter
    .flatMap((p) => p.conditions.map((x) => ({ ...x, field: p.field })))
    .map((p) => {
      const parameterName = `${p.field}${p.conditionType}`;
      const queryString = `${dbAlias}.${camelToSnakeCase(
        p.field,
      )} ${conditionTypeToOperation(p.conditionType)} ${valueToSql(
        parameterName,
        p.value,
      )}`;
      const parameterObject = {
        [parameterName]: p.value,
      };
      return [queryString, parameterObject];
    });
};

(SelectQueryBuilder.prototype as any).applySearchQuery = function (
  dbAlias: string,
  sort: SortDto[],
  filter?: FieldFilterDto[],
  page?: PageDto,
) {
  let self = this as SelectQueryBuilder<any>;

  if (page) {
    self.limit(page.size);
    self.offset(page.size * page.number - page.size);
  }

  if (filter) {
    const whereParams = buildWhereParameters(dbAlias, filter);

    self = whereParams.reduce((previous, whereParam, index) => {
      const command = index === 0 ? previous.where : previous.andWhere;

      return command.apply(previous, whereParam);
    }, self);
  }

  return self.orderBy(
    sort.reduce((obj, item) => {
      obj[`${dbAlias}.` + item.field] = item.direction;
      return obj;
    }, {}),
  );
};
