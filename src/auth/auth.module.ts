import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { AuthController } from './controllers';
import { AuthService } from './services';
import { AuthRepository } from './repositories';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [AuthController],
    providers: [AuthService, AuthRepository],
    exports: [],
})
export class AuthModule {}
