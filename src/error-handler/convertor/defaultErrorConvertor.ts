import { status } from "@grpc/grpc-js";
import { GrpcError } from "../error";
import { ErrorLevel } from "../errorLevel";

export const defaultErrorConverter = (err: any): GrpcError => {
  let error = err;

  // 내가 정의 한 error가 아닌경우 GrpcError 형식으로 감싸는 로직
  if (error instanceof GrpcError) {
    return error;
  }

  // 예상치 못한 에러
  else {
    // error에 statusCode가 있으면 사용, 없으면 일단 500 에러
    //  < TODO : 어떤 오류냐에 따라 더 세세한 구분이 필요함. 해당 부분은 더 찾아보고 추가적인 작업 필요
    const statusCode: number =
      error.statusCode || status.INTERNAL;

    // 외부 노출 메시지
    const message: string = "처리 중 에러가 발생했습니다";

    // 메시지가 있으면 사용, 없으면 http 상태 코드에 따른 표준 출력
    const internalMessage =
      error.message || status[statusCode];;

    error = new GrpcError(
      statusCode,
      message,
      false,
      ErrorLevel.ERROR,
      err.stack,
      internalMessage,
    );
  }

  return error;
};