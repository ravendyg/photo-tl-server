import * as Express from 'express';

export interface IUser {
    id: number,
    uid: string,
    name: string,
}

export interface IRequestMetadata {
    user: IUser,
}

export interface IEnrichedRequest extends Express.Request {
    metadata: IRequestMetadata,
}
