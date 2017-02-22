'use strict';

class UbersmithError extends Error {
    constructor(message, code) {
        super(message);

        this.name = this.constructor.name;
        this.code = code;

        Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
    }
}

class UbersmithApplicationError extends UbersmithError {
    constructor(error) {
        super(error.error_message || 'API call failure');
        this.error = error;
    }
}

class UbersmithTransportError extends UbersmithError {
    constructor(message, code) {
        super(message || 'An unknown error occurred');
        this.code = code;
    }
}

module.exports = {
    ubersmithError: UbersmithError,
    ubersmithTransportError: UbersmithTransportError,
    ubersmithApplicationError: UbersmithApplicationError,
};

