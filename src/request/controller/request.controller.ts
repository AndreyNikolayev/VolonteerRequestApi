import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { CreateRequestCommand } from '../command/create-request.command';
import { CloseRequestCommand } from '../command/close-request.command';
import { GetRequestDetailsQuery } from '../query/get-request-details.query';
import { UserId } from 'src/common/decorator/user-id.decorator';
import { CreateRequestCommandDto } from '../dto/client-details.dto';
import { Role } from 'src/user/enum/role';
import { PlainBody } from 'src/common/decorator/plain-body.decorator';
import { AddRequestFoundCommand } from '../command/add-request-found.command';
import { SearchQuery } from 'src/common/decorator/search-query.decorator';
import { SearchQueryDto } from 'src/common/dto/search-query.dto';
import { GetRequestsViewQuery } from '../query/get-requests-view.query';

@Controller('requests')
export class RequestController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Roles(Role.ADMIN, Role.CLIENT)
  @Post()
  async create(
    @Body() createRequestCommandDto: CreateRequestCommandDto,
    @UserId() userId: number,
  ) {
    await this.commandBus.execute(
      new CreateRequestCommand(
        createRequestCommandDto.name,
        createRequestCommandDto.description,
        createRequestCommandDto.unit,
        createRequestCommandDto.requested,
        userId,
      ),
    );
  }

  @Roles(Role.ADMIN, Role.CLIENT)
  @Post(':id/close')
  async close(@Param('id', ParseIntPipe) id: number, @UserId() userId: number) {
    await this.commandBus.execute(new CloseRequestCommand(id, userId));
  }

  @Roles(Role.ADMIN, Role.CLIENT)
  @Post(':id/found')
  async markFound(
    @Param('id', ParseIntPipe) id: number,
    @UserId() userId: number,
    @PlainBody() amount: number,
  ) {
    await this.commandBus.execute(
      new AddRequestFoundCommand(id, amount, userId),
    );
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return await this.queryBus.execute(new GetRequestDetailsQuery(id));
  }

  @Get()
  search(@SearchQuery() query: SearchQueryDto) {
    const queryBuilderResult = GetRequestsViewQuery.fromSearchQuery(query);

    if (!queryBuilderResult.isSuccess) {
      throw new BadRequestException(queryBuilderResult.errors);
    }

    return this.queryBus.execute(queryBuilderResult.value);
  }
}
