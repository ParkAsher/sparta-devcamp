import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthRepository } from '../repositories';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CustomException } from 'src/exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly authRepository: AuthRepository) {}

    // 회원가입
    async createUser(user: CreateUserDto) {
        const findUser = await this.authRepository.findUserByEmail(user.email);

        // 존재한다면 에러반환
        if (findUser) {
            throw new CustomException(
                'auth',
                'user already exist',
                'user already exist',
                HttpStatus.BAD_REQUEST,
            );
        }

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(user.password, 10);

        user.password = hashedPassword;

        return this.authRepository.createUser(user);
    }
}
