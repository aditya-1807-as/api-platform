package com.example.apiplatform.exception;

import org.springframework.http.HttpStatus;

public class QuotaExceededException extends ApiException {

    public QuotaExceededException(String message) {
        super(message, HttpStatus.TOO_MANY_REQUESTS);
    }
}
