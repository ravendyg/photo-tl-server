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
    userName: string;
    date: string;
    text: string;
}

export interface ICommentDto {
    cid: string;
    date: string;
    text: string;
    iid: string;
    uid: string;
    userName: string;
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

export interface IPhotoPatchRequest {
    iid: string;
    description: string;
    title: string;
}

export interface IPhotoPatch extends IPhotoPatchRequest {
    changed: string;
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

export interface IDTOWrapper {
    error?: string;
    payload?: string;
    status: number;
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

export interface IDeletedComment {
    cid: string;
    iid: string;
}


export interface IRatingUpdateRequest {
    iid: string,
    rating: number
}

export interface INewMessageRequest {
    iid: string;
    text: string;
}

export interface IDeleteMessageRequest {
    cid: string;
}

export interface IDeletePhotoRequest {
    iid: string;
}

export interface IViewReport {
    iid: string;
}
