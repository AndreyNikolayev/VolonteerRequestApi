import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { FieldFilterConditionDto } from '../dto/field-filter-condition.dto';
import { FieldFilterDto } from '../dto/field-filter.dto';
import { SearchQueryDto } from '../dto/search-query.dto';
import { SortDto } from '../dto/sort.dto';
import { FilterCondition } from '../enum/filter-condition.enum';
import { PageDto } from '../dto/page.dto';

const parseSort = (value: string): SortDto[] => {
  const fields = value.split(',');

  if (fields.some((p) => !p || !/^-?[\w.]+$/.test(p))) {
    throw new BadRequestException('sort value should be alphanumeric');
  }

  return fields.map(
    (p) => new SortDto(p.replace(/^-/, ''), p.startsWith('-') ? 'DESC' : 'ASC'),
  );
};

const parseFilter = (value: any): FieldFilterDto[] => {
  if (!value) {
    return null;
  }

  return Object.keys(value).map((fieldName) => {
    if (!fieldName || !value[fieldName] || !/^[\w.]+$/.test(fieldName)) {
      throw new BadRequestException(`filter keys should be alphanumeric`);
    }

    const conditions = Object.keys(value[fieldName]).map((operationName) => {
      if (
        !Object.values(FilterCondition).includes(
          operationName as FilterCondition,
        )
      ) {
        throw new BadRequestException(
          `invalid filter operation ${operationName}`,
        );
      }

      return new FieldFilterConditionDto(
        operationName as FilterCondition,
        (operationName as FilterCondition) === FilterCondition.In
          ? value[fieldName][operationName].split(',')
          : value[fieldName][operationName],
      );
    });

    return new FieldFilterDto(fieldName, conditions);
  });
};

const parsePage = (page: any) => {
  [page?.number, page?.size].forEach((param) => {
    if (Number.isNaN(Number.parseInt(param))) {
      throw new BadRequestException('Invalid page param');
    }
  });

  return new PageDto(+page.number, +page.size);
};

export const SearchQuery = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): SearchQueryDto => {
    const request = ctx.switchToHttp().getRequest();

    const sort = request.query['sort']
      ? parseSort(request.query['sort'])
      : null;
    const filter = request.query['filter']
      ? parseFilter(request.query['filter'])
      : null;
    const page = request.query['page']
      ? parsePage(request.query['page'])
      : null;

    return new SearchQueryDto(sort, filter, page);
  },
);
