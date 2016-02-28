interface IDispatcher {
    dispatch (payload: any): void;
    register (listener: any): number;
    unregister (listenerId: number): void;
}

interface IUser {
    name: string,
    pas?: string,
    pas2?: string,
    rem?: boolean,
    error?: string,
    then?: any
}

declare type ratingElement = {
    user: string,
    val: number
}
declare type averageRating = {
    count: number,
    val: number
}

interface IImage {
    _id: string,
    src: string,
    title: string,
    description: string,
    uploaded: number,
    changed: number,
    uploadedBy: string,
    changedBy: string,
    averageRating: averageRating,
    rating: ratingElement [],
    views: number,
    comments: {
        userName: string,
        text: string
    } []
}

interface IImageService {
    getImageData (): any;
    uploadPhoto (file: any): any;
}

interface IUtils {
    transformDate (num: number): string;
}

interface ISocketService {
    connect (url: string): void;
    disconnect (): void;
    getConnection (): any;
    removePhoto (_id: string): void;
    uploadPhoto (filename: string, title: string, text: string): void;
    vote (newVote: number, _id: string): void;
}

interface IUserActions {
    signin (user: IUser): void;
    signup (user: IUser): void;
    signout (user: IUser): void;
    confirmed (): void;
}

interface IRatingCtrl {
}

interface INewRating {
    _id: string,
    averageRating: averageRating,
    ratingElem: ratingElement
}

interface IImageStoreFactory extends IDispatcher {
    addListener (callback: any): number;
    removeListener (callbackId: number): void;
    replaceComment (newRating: INewRating): void;
    getAverageRating (photoId: string): number;
    getUserRating (photoId: string, userName: string): number;
}