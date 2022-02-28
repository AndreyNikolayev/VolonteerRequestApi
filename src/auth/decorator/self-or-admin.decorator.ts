import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from 'src/user/enum/role';
import { SelfOrAdminGuard } from '../guard/self-or-admin.guard';
import { Roles } from './roles.decorator';

export const ID_PARAM_KEY = 'id_param';

export function SelfOrAdmin(_idParam = 'id') {
  return applyDecorators(
    Roles(Role.ADMIN, Role.CLIENT),
    SetMetadata(ID_PARAM_KEY, _idParam),
    UseGuards(SelfOrAdminGuard),
  );
}
