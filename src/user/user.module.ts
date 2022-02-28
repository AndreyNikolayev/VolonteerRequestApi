import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { CommonModule } from '../common/common.module';
import { InviteClientEmailSender } from './service/invite-client-email-sender';
import { AuthModule } from '../auth/auth.module';
import { InviteClientCommandHandler } from './handler/command/invite-client-command.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { EditUserCommandHandler } from './handler/command/edit-user-command.handler';
import { GetClientDetailsQueryHandler } from './query/get-client-details.query';
import { UserController } from './controller/user.controller';

const handlers = [
  EditUserCommandHandler,
  GetClientDetailsQueryHandler,
  InviteClientCommandHandler,
];

const services = [InviteClientEmailSender];

const repositories = [UserRepository];

@Module({
  imports: [
    AuthModule,
    CqrsModule,
    CommonModule,
    TypeOrmModule.forFeature(repositories),
  ],
  providers: [...handlers, ...services],
  controllers: [UserController],
})
export class UserModule {}
