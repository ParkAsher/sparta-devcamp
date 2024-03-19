import { ConfigService } from '@nestjs/config';
import { NestApplicationOptions } from '@nestjs/common';
import {
    WinstonModule,
    utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';

export function NestOptions(): NestApplicationOptions {
    const configService = new ConfigService();
    const env = configService.get<string>('RUNTIME');
    const serviceName = configService.get<string>('SERVICE_NAME');

    return {
        // 부트스트래핑까지 포함하여 winstonlogger 사용하기
        logger: WinstonModule.createLogger({
            transports: [
                new winston.transports.Console({
                    level: 'silly',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        nestWinstonModuleUtilities.format.nestLike(
                            serviceName,
                            {
                                colors: true,
                                prettyPrint: true,
                            },
                        ),
                    ),
                }),
            ],
        }),
    };
}
