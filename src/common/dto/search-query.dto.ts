import { FieldFilterDto } from './field-filter.dto';
import { SortDto } from './sort.dto';
import { PageDto } from './page.dto';

export class SearchQueryDto {
  constructor(
    public readonly sort: SortDto[],
    public readonly filter: FieldFilterDto[],
    public readonly page: PageDto,
  ) {}
}
