import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CustomExceptionFilter } from './exception';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

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
