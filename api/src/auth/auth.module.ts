import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { LdapStrategy } from './strategies/ldap.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    UserModule, 
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET_KEY_2025',
      signOptions: { expiresIn: '1d' },
    }),
  ], 
  controllers: [AuthController],
  providers: [
    AuthService, 
    LocalStrategy, 
    LdapStrategy,
    JwtStrategy,
    RolesGuard,
  ],
  exports: [JwtModule, RolesGuard],
})
export class AuthModule {}
