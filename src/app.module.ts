import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptors';
import { TypeOrmModule } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env`,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_DATABASE'),
                autoLoadEntities: true, // 엔티티들이 자동으로 불려와짐
                synchronize: configService.get<string>('RUNTIME') !== 'prod', // 배포환경이 아니면 true
                logging: configService.get<string>('RUNTIME') !== 'prod',
            }),
            // typeorm의 엔티티들을 트랜잭션에서 사용할 수 있도록 datasource에 추가
            async dataSourceFactory(options) {
                if (!options) {
                    throw new Error('Invalid options passed');
                }
                return addTransactionalDataSource(new DataSource(options));
            },
        }),
        AuthModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class AppModule {}
