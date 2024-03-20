import { Controller, Post } from '@nestjs/common';
import { AuthService } from '../services';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signup() {}
}
