import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestRepository } from './repository/request.repository';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../auth/auth.module';
import { CqrsModule } from '@nestjs/cqrs';
import { RequestController } from './controller/request.controller';
import { AddRequestFoundCommandHandler } from './command/add-request-found.command';
import { CloseRequestCommandHandler } from './command/close-request.command';
import { CreateRequestCommandHandler } from './command/create-request.command';
import { GetRequestDetailsQueryHandler } from './query/get-request-details.query';
import { GetRequestsViewQueryHandler } from './query/get-requests-view.query';
import { UserModule } from 'src/user/user.module';

const handlers = [
  AddRequestFoundCommandHandler,
  CloseRequestCommandHandler,
  CreateRequestCommandHandler,
  GetRequestDetailsQueryHandler,
  GetRequestsViewQueryHandler,
];

const repositories = [RequestRepository];

@Module({
  imports: [
    AuthModule,
    CqrsModule,
    CommonModule,
    UserModule,
    TypeOrmModule.forFeature(repositories),
  ],
  providers: [...handlers],
  controllers: [RequestController],
})
export class RequestModule {}
