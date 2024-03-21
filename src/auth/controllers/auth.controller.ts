import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services';
import { CreateUserDto, LoginUserDto } from '../dtos';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // 회원가입
    @Post('signup')
    async signup(@Body() user: CreateUserDto) {
        const createdUser = await this.authService.createUser(user);

        return createdUser;
    }

    // 로그인
    @Post('login')
    async login(@Body() user: LoginUserDto) {
        return await this.authService.login(user.email, user.password);
    }
}
