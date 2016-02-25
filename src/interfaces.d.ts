/// <reference path="../typings/others.d.ts" />

interface IEventEmmiter {
    emit (event: any): void;
    addListener (listener: any): number;
    removeListener (listenerId: number): void;
    setToken (tokenName: string, listenerId: number);
    getTokens (): any;
    startHandling (tokenName: string): void;
    stopHandling (tokenName: string): void;
    waitFor (tokens: string [], promise: any, owner: string): any;
}

interface IUser {
    name: string,
    pas?: string,
    pas2?: string,
    rem?: boolean,
    error?: string,
    then?: any
}

interface IImage {
    _id: string,
    src: string,
    title: string,
    description: string,
    uploadedNum: number,
    changedNum: number,
    uploaded?: string,
    changed?: string,
    rating: number,
    myRating: number,
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
}