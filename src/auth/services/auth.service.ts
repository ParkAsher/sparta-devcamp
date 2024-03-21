import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthRepository } from '../repositories';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CustomException } from 'src/exception';
import * as bcrypt from 'bcrypt';
import { User } from '../entities';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

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

    // 로그인
    async login(email: string, password: string) {
        // 회원 인증
        const user = await this.validateUser(email, password);

        // 엑세스 토큰 생성
        const accessToken = await this.createAccessToken(user);
        // 리프레시 토큰 생성
        const refreshToken = await this.createRefreshToken(user);

        return {
            accessToken,
            refreshToken,
            user,
        };
    }

    // 회원 인증
    async validateUser(email: string, password: string) {
        const findUser = await this.authRepository.findOne({
            where: { email },
        });

        // 회원이 없거나, 비밀번호가 일치하지 않는다면
        if (!findUser || !(await bcrypt.compare(findUser.password, password))) {
            throw new CustomException(
                'auth',
                'invalid user',
                'invalid user',
                HttpStatus.UNAUTHORIZED,
            );
        }

        return findUser;
    }

    // 엑세스 토큰 생성
    async createAccessToken(user: User) {
        const payload = { userId: user.id };
        const expiresIn = this.configService.get<string>('ACCESS_TOKEN_EXPIRE');
        const accessToken = this.jwtService.signAsync(payload, {
            expiresIn,
        });

        return accessToken;
    }

    // 리프레시 토큰 생성
    async createRefreshToken(user: User) {
        const payload = { userId: user.id };
        const expiresIn = this.configService.get<string>(
            'REFRESH_TOKEN_EXPIRE',
        );
        const refreshToken = this.jwtService.signAsync(payload, {
            expiresIn,
        });

        return refreshToken;
    }
}
