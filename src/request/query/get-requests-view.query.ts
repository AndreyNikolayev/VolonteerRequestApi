import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { SortDto } from 'src/common/dto/sort.dto';
import { SearchQueryDto } from 'src/common/dto/search-query.dto';
import { Result } from 'src/common/result/result';
import { FieldFilterDto } from 'src/common/dto/field-filter.dto';
import { isIsoDate } from 'src/common/validation/is-iso-date';
import { RequestRepository } from '../repository/request.repository';

export class GetRequestsViewQuery {
  constructor(
    public readonly sort: SortDto[],
    public readonly filter?: FieldFilterDto[],
  ) {}

  static fromSearchQuery(
    searchQuery: SearchQueryDto,
  ): Result<GetRequestsViewQuery> {
    if (!searchQuery) {
      return Result.Error(['SearchQuery is empty']);
    }

    const sort = searchQuery.sort ?? [new SortDto('id', 'DESC')];

    return Result.Success(new GetRequestsViewQuery(sort, searchQuery.filter));
  }
}

@QueryHandler(GetRequestsViewQuery)
export class GetRequestsViewQueryHandler
  implements IQueryHandler<GetRequestsViewQuery>
{
  constructor(private readonly requestRepository: RequestRepository) {}

  execute(command: GetRequestsViewQuery): Promise<any[]> {
    return this.requestRepository.getView(command);
  }
}
