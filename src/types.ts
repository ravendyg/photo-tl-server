import * as Express from 'express';

export interface IUser {
    id: number,
    uid: string,
    name: string,
}

export interface IUserDto {
    uid: string,
    name: string,
}

export interface IRequestMetadata {
    user: IUser,
}

export interface IEnrichedRequest extends Express.Request {
    metadata: IRequestMetadata,
}

export interface IPhoto {
    id: number;
    iid: string;
    description: string;
    title: string;
    uploadedBy: IUser;
    uploaded: number;
    changed: number;
}

export interface IPhotoDto {
    iid: string;
    description: string;
    title: string;
    uploadedBy: IUserDto;
    uploaded: number;
    changed: number;
}
