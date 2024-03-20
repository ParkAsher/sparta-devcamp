import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class AuthRepository extends Repository<User> {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super(
            userRepository.target,
            userRepository.manager,
            userRepository.queryRunner,
        );
    }

    // 이메일을 이용해서 회원 찾기
    async findUserByEmail(email: string) {
        return this.userRepository.findOneBy({ email });
    }

    // DB에 회원 데이터 저장
    async createUser(user: CreateUserDto) {
        return this.userRepository.save(user);
    }
}
