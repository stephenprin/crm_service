import { Response } from "express";
import { HttpStatus } from "../utils/constants/http_status";
import { ErrorType } from "../utils/constants/error_type";

export function errorHandler(err: any, res: Response) {

  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let errorType = err.type || ErrorType.INTERNAL_ERROR;
  let message = err.message || "Something went wrong";

  if (Number.isInteger(err.code)) {
    statusCode = err.code;
  }

  if (typeof err.code === "string") {
    const pgCodeMap: Record<string, number> = {
      "23505": HttpStatus.CONFLICT,
      "23503": HttpStatus.BAD_REQUEST,
      "42703": HttpStatus.BAD_REQUEST,
    };

    if (pgCodeMap[err.code]) {
      errorType = ErrorType.INTERNAL_ERROR;
    }
  }

  return res.status(statusCode).json({
    error: errorType,
    message,
  });
}
