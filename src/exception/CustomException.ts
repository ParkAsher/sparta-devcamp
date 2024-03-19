import { HttpStatus } from '@nestjs/common';

// 에러의 종류
export type ErrorDomain =
    | 'generic'
    | 'auth'
    | 'user'
    | 'payment'
    | 'investment';

export class CustomException extends Error {
    public readonly timestamp: Date;

    constructor(
        public readonly domain: ErrorDomain,
        public readonly message: string,
        public readonly apiMessage: string,
        public readonly status: HttpStatus,
    ) {
        super(message);
        this.timestamp = new Date();
    }
}
