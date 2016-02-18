import {config} from './../config.ts';

export class UserService {
    private _http: any;
    private _loggedInUser: any;
    
    constructor ($http) {
        this._http = $http;

    }
    
    public getUserFromMemory () {
        return JSON.parse(localStorage.getItem('photoUser'));
    }
    
    public signup (user: IUser) {
        return this._http({
                    method: 'POST',
                    url: config('url') + config('port') + config('userDriver') + '/new-user',
                    data: user
                });           
    }
}