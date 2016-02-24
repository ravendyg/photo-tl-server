/// <reference path="./../interfaces.d.ts" />
import {config} from './../config.ts';

export class ImageService implements IImageService {
    private _http: any;
    private _q: any;
    private _timeout: any;
    private _loggedInUser: any;
    
    constructor ($http, $q, $timeout) {
        this._http = $http;
        this._q = $q;
        this._timeout = $timeout;
    }
    
    public getImageData () {
        // real call to the server
        return this._http({
            method: 'GET',
            url: config('url') + config('port') + config('imageDriver') + '/all-images'
        });
    }
    
    // sends a request to the server to delete specified image1// to be implemented
    public deleteImage (id: number): void {
console.log('server delete image');
        // this._http({
        //     method: 'DELETE',
        //     url: ''
        // })
    }
}