import { ErrorLevel } from "./errorLevel";

export class GrpcError extends Error {
  public status: number;
  public isOperational: boolean;
  public level: ErrorLevel;

  // message : 외부 출력용 메시지

  // 내부 로깅용 메시지
  public internalMessage?: string;

  constructor(
    status: number,
    message: string,
    isOperational: boolean = true,
    level: ErrorLevel = ErrorLevel.WARN,
    stack?: string,
    internalMessage?: string,
  ) {
    super(message);
    this.status = status;
    this.isOperational = isOperational;
    this.level = level;
    this.name = "GrpcError";

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    if (internalMessage) {
      this.internalMessage = internalMessage;
    }
  }
}