import { Body, Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/signIn.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('signup')
  async signUp() {
    return 'signup';
  }

  @Get('signin')
  async signIn(@Body() formData: SignInDTO) {
    return this.authService.signIn(formData);
  }
}
