import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/user/enum/role';
import { ID_PARAM_KEY } from '../decorator/self-or-admin.decorator';

@Injectable()
export class SelfOrAdminGuard {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const idParamKey = this.reflector.get<string>(
      ID_PARAM_KEY,
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    return (
      request.user.role === Role.ADMIN ||
      request.user.id === +request.params[idParamKey]
    );
  }
}
