package com.troupe.backend.advice;

import com.troupe.backend.exception.DuplicatedException;
import com.troupe.backend.exception.EmailUnauthenticatedException;
import com.troupe.backend.exception.InvalidAccessTokenException;
import com.troupe.backend.exception.UnauthorizedException;
import com.troupe.backend.exception.member.WrongPasswordException;
import com.troupe.backend.util.MyConstant;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionAdvice {
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity handleNoSuchElementException(NoSuchElementException e) {
        e.printStackTrace();
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put(MyConstant.MESSAGE, e.getMessage());
        return new ResponseEntity(resultMap, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicatedException.class)
    public ResponseEntity handleDuplicateException(DuplicatedException e) {
        e.printStackTrace();
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put(MyConstant.MESSAGE, e.getMessage());
        return new ResponseEntity(resultMap, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity handleUnauthorizedException(UnauthorizedException e) {
        e.printStackTrace();
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put(MyConstant.MESSAGE, e.getMessage());
        return new ResponseEntity(resultMap, HttpStatus.UNAUTHORIZED);
    }

    // EmailUnauthenticatedException
    @ExceptionHandler(EmailUnauthenticatedException.class)
    public ResponseEntity handleEmailUnauthenticatedException(EmailUnauthenticatedException e) {
        e.printStackTrace();
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put(MyConstant.MESSAGE, e.getMessage());
        return new ResponseEntity(resultMap, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(WrongPasswordException.class)
    public ResponseEntity handleWrongPasswordException(WrongPasswordException e) {
        e.printStackTrace();
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put(MyConstant.MESSAGE, e.getMessage());
        return new ResponseEntity(resultMap, HttpStatus.UNAUTHORIZED);
    }


    @ExceptionHandler(InvalidAccessTokenException.class)
    public ResponseEntity handleInvalidAccessTokenException(InvalidAccessTokenException e) {
        e.printStackTrace();
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put(MyConstant.MESSAGE, e.getMessage());
        return new ResponseEntity(resultMap, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity handleException(Exception e) {
        e.printStackTrace();
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put(MyConstant.MESSAGE, e.getMessage());
        return new ResponseEntity(resultMap, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}