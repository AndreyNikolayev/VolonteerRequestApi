import { EntityRepository, Repository } from 'typeorm';
import { Request } from '../entity/request';
import { GetRequestsViewQuery } from '../query/get-requests-view.query';

@EntityRepository(Request)
export class RequestRepository extends Repository<Request> {
  async getView(query: GetRequestsViewQuery): Promise<any[]> {
    const queryBuilder = this.createQueryBuilder('request');

    const result = await queryBuilder
      .applySearchQuery('request', query.sort, query.filter)
      .getMany();

    return result;
  }
}
