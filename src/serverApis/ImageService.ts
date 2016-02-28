/// <reference path="./../../typings/interfaces.d.ts" />

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
    
    public getImageData (): void {
        // real call to the server
        return this._http({
            method: 'GET',
            url: config('url') + config('port') + config('imageDriver') + '/all-images'
        });
    }
    
    public uploadPhoto (file: HTMLInputElement): any {
        // promise for controller
        var deferred = this._q.defer();
        
        // ajax
        var xhr = new XMLHttpRequest();
        xhr.open('POST', config('url') + config('port') + config('imageDriver') + '/upload-image');
        
        xhr.onload = function () {
            deferred.resolve(JSON.parse(xhr.responseText).filename);
        };
        
        xhr.onreadystatechange = function() {
            console.log(xhr.status);
        };
        
        xhr.onerror = function (err) {
            console.error(err);
            deferred.reject();
        };
        
        xhr.upload.onprogress = function (e) {
            console.log(e.total);
            console.log(e.loaded / e.total);
        };
        
        xhr.send(file);
        
        return deferred.promise;
    }

}