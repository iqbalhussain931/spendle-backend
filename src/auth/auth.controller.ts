import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import AuthService from './auth.service';
import { AuthSignupDto, AuthSigninDto } from './dto';

@Controller('auth')
class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthSignupDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthSigninDto) {
    return this.authService.signin(dto);
  }
}

export default AuthController;
