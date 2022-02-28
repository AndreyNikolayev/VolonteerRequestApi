import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { REFRESH_TOKEN_STRATEGY } from '../service/jwt.refresh-token-strategy';

@Injectable()
export class RefreshGuard extends AuthGuard(REFRESH_TOKEN_STRATEGY) {}
