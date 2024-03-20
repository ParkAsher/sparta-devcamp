import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services';
import { CreateUserDto } from '../dtos/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // 회원가입
    @Post('signup')
    async signup(@Body() user: CreateUserDto) {
        const createdUser = await this.authService.createUser(user);

        return createdUser;
    }
}
