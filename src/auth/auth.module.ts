import { Module } from '@nestjs/common';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
class AuthModule {
  // This class is currently empty, but it can be extended in the future
  // to include providers, controllers, and other configurations related to authentication.
}

export { AuthModule };
