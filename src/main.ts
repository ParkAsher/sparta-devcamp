import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CustomExceptionFilter } from './exception';
import { NestOptions } from './app.options';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
    // 컨텍스트 간에 데이터를 격리하고, 공유할 수 있는 메커니즘을 제공하는 cls-hooked의 NameSpace를 초기화 하는 과정
    // 참고 : https://velog.io/@wndbsgkr/NestJS%EC%97%90%EC%84%9C-Transaction-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0feat.-TypeORM
    initializeTransactionalContext();

    const app = await NestFactory.create(AppModule, NestOptions());

    // CustomExceptionFilter 설정
    app.useGlobalFilters(new CustomExceptionFilter());

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT');
    const env = configService.get<string>('RUNTIME');
    const serviceName = configService.get<string>('SERVICE_NAME');

    console.log(`runtime: ${env}, port: ${port}, serviceName: ${serviceName}`);

    await app.listen(port);
}
bootstrap();
