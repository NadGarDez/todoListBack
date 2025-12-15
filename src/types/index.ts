import { CognitoAccessTokenPayload } from "aws-jwt-verify/jwt-model";
import { Request, Response, NextFunction } from 'express';

export interface TaskInput {
    title: string;
    description?: string;
    labels: string[];
    done?: boolean; 
}

export interface TaskOutput {
    id: number;
    title: string;
    description: string | null;
    labels: string[]; 
    done: boolean;
    createdAt: Date;
    updatedAt: Date;
}


export interface AuthRequest extends Request {
  user?: CognitoAccessTokenPayload;
}