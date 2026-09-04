import { Metadata, status } from "@grpc/grpc-js";

import { Logger } from "winston";
import { defaultErrorConverter } from "./convertor/defaultErrorConvertor";
import { defaultLogger } from "./defaultLogger";
import { GrpcError } from "./error";
// import { errorConverter } from "./errorConvertor";

export interface HandlerOptions{
    profile? : 'prod' | 'dev' | 'test' 
    customErrorConvertor?: (err : any) => GrpcError,
    logger ?: Logger,
    
}


const createGrpcErrorHandler = (options :  HandlerOptions = {}) => {
    const {
        profile = 'prod',
        customErrorConvertor = defaultErrorConverter,
        logger = defaultLogger
    } = options;

    return  (err : any ) =>{
        // 1. 에러 변환
        let convertedErr: GrpcError = customErrorConvertor(err);

        // 2. 로그
        logger.error(convertedErr);

        // 3. 반환 데이터
        let errorResponse: GrpcErrorPayload = {
            code: convertedErr.status,
            details: convertedErr.message,
        };

        // 4. 배포 환경이면서 예상치 못한 에러의 경우
        // 위험한 메시지가 노출 안되도록 덮어씌움.
        if (profile === "prod" && !convertedErr.isOperational) {
            errorResponse.code = status.INTERNAL;
            errorResponse.details = "처리 중 에러가 발생했습니다";
        }

        return errorResponse;
    }


} 

export let GrpcErrorHandler : (err: any) => GrpcErrorPayload = createGrpcErrorHandler();

export const initGrpcErrorHandler = (options :  HandlerOptions) =>{
    GrpcErrorHandler = createGrpcErrorHandler(options);
}


export interface GrpcErrorPayload {
  code: status;
  details: string;
  metadata?: Metadata;
}
