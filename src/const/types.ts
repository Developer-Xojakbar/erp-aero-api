import { ParsedQs } from 'qs';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EmptyParams {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResBody = any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReqBody = any;

export interface ErrorResponse {
    success: boolean;
    statusCode: number;
    message: string;
    isOperational: boolean;
    details?: object;
}

export interface MongoDocIdParams {
    id: string;
}

export interface AuthPayload {
    id: number;
    refreshToken: string;
}

export interface RequestUser {
    id: number;
    refreshToken: string;
}

export interface SignupRequestBody {
    email: string;
    password: string;
}

export interface SigninRequestBody extends SignupRequestBody {}

export interface SigninNewTokenRequestBody {
    refreshToken: string;
}

export interface AuthServiceLogout extends SigninNewTokenRequestBody {}

export interface FileServiceUpload {
    id: number;
    fileData: Express.Multer.File;
}

export interface FileServiceUpdate extends FileServiceUpload {
    fileId: number;
}

export interface FileListQuery extends ParsedQs {
    page: string;
    list_size: string;
}

export interface FileServiceList {
    id: number;
    page: number;
    listSize: number;
}

export interface FileServiceGetOne {
    id: number;
    fileId: number;
}

export interface FileServiceDelete extends FileServiceGetOne {}
