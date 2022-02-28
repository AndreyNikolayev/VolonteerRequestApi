import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseProviderModule } from './database/providers/database-provider.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    AuthModule,
    DatabaseProviderModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  exports: [CommonModule],
})
export class AppModule {}
