export declare class ApiResponseDto<T> {
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
}
export declare class PaginatedResponseDto<T> {
    statusCode: number;
    message: string;
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    timestamp: string;
}
export declare class ErrorResponseDto {
    statusCode: number;
    message: string;
    error: string;
    details?: Array<{
        field: string;
        message: string;
        value?: any;
    }>;
    timestamp: string;
}
