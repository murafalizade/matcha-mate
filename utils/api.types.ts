export interface FieldError {
    field: string;
    messages: string[];
}

export interface ApiPagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface ApiEnvelope<T> {
    success: boolean;
    statusCode: number;
    message?: string;
    data: T;
    pagination?: ApiPagination;
    errors?: FieldError[];
    timestamp: string;
}
