import { HttpStatusCode } from '../../utils/status-codes.js';

export abstract class GlobalError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class InternalServerError extends GlobalError {
    constructor(message = 'Internal Server Error') {
        super(message, HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
}

export class BadRequestError extends GlobalError {
    constructor(message = 'Bad Request') {
        super(message, HttpStatusCode.BAD_REQUEST);
    }
}

export class NotFoundError extends GlobalError {
    constructor(message = 'Not Found') {
        super(message, HttpStatusCode.NOT_FOUND);
    }
}

export class UnauthorizedError extends GlobalError {
    constructor(message = 'Unauthorized') {
        super(message, HttpStatusCode.UNAUTHORIZED);
    }
}

export class ForbiddenError extends GlobalError {
    constructor(message = 'Forbidden') {
        super(message, HttpStatusCode.FORBIDDEN);
    }
}

export class ConflictError extends GlobalError {
    constructor(message = 'Conflict') {
        super(message, HttpStatusCode.CONFLICT);
    }
}
