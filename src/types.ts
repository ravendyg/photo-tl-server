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
    user?: IUser,
}

declare global {
    namespace Express {
        interface Request {
            metadata: IRequestMetadata,
        }
    }
}

export interface IComment {
    id: number;
    cid: string;
    iid: string;
    uid: string;
    date: number;
    text: string;
}

export interface ICommentDto {
    cid: string;
    date: number;
    text: string;
}

export interface IPhotoRequest {
    iid: string;
    extension: string;
    description: string;
    title: string;
    uploadedBy: IUser;
}

export interface IPhoto {
    id: number;
    iid: string;
    extension: string;
    description: string;
    title: string;
    uploadedBy: IUser;
    uploaded: number;
    changed: number;
    commentCount: number;
    averageRating: number;
    ratingCount: number
    userRating: number;
    views: number;
}

export interface IPhotoPatch {
    iid: string;
    description: string;
    title: string;
    changed: number;
}

export interface IPhotoDto {
    iid: string;
    extension: string;
    description: string;
    title: string;
    uploadedBy: IUserDto;
    uploaded: number;
    changed: number;
    commentCount: number;
    averageRating: number;
    ratingCount: number
    userRating: number;
    views: number;
}

export interface IRating {
    uid: string;
    iid: string;
    value: number;
    count: number;
    averageRating: number;
}

export interface IPatchPhotoRequest {
    iid: string;
    user: IUser;
    title: string;
    description: string;
}
