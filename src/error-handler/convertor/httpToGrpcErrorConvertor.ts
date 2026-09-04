import { status } from "@grpc/grpc-js";
import { GrpcError } from "../error";

// 파라미터 정의 
export interface HttpErrorPayload {
  status: number;
  message?: string;
  isOperational?: boolean;
  level?: any; 
  stack?: string;
  internalMessage?: string;
}

export const httpToGrpcErrorConverter = (httpErr: HttpErrorPayload): GrpcError => {
  
  const {
    status,
    message = "Unknown Error",
    isOperational = true, // 기본값 true
    level,
    stack,
    internalMessage
  } = httpErr;

  const grpcStatusCode = getGrpcStatus(status);

  return new GrpcError(
    grpcStatusCode,
    message,
    isOperational,
    level,
    stack,
    internalMessage
  );
};

export const httpToGrpcStatus: Record<number, status> = {
  400: status.INVALID_ARGUMENT,
  401: status.UNAUTHENTICATED,
  403: status.PERMISSION_DENIED,
  404: status.NOT_FOUND,
  409: status.ALREADY_EXISTS,
  429: status.RESOURCE_EXHAUSTED,
  500: status.INTERNAL,
  501: status.UNIMPLEMENTED,
  503: status.UNAVAILABLE,
  504: status.DEADLINE_EXCEEDED,
};

// 매핑 안 된 코드는 500으로 처리
export const getGrpcStatus = (httpCode: number): status => {
  return httpToGrpcStatus[httpCode] || status.INTERNAL;
};