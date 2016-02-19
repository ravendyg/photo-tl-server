import {config} from './../config.ts';

export class UserService {
    private _http: any;
    private _q: any;
    private _loggedInUser: any;
    
    constructor ($http, $q) {
        this._http = $http;
        this._q = $q;
    }
    
    public getUserFromMemory () {
        var deferred = this._q.defer();
        // check session storage
        var cookies: string [] = document.cookie.split(';');
        var name = cookies.filter( (obj) => obj.indexOf('uId=') > -1 )[0];
        if (name) {
            // already logged in
            //verify
            this._http({
                method: 'GET',
                url: config('url') + config('port') + config('userDriver') + '/verify-user',
                params: {name: name.split('%7C')[0].split('=')[1]}
            }).then( (response) => {
                deferred.resolve(response.data.name);
            }, (response) => {
                // no confirmatin from the server
                deferred.resolve('');
            })
        } else {
            // not loggedin
            deferred.resolve('');
        }
        
        return deferred.promise;
    }
    
    public signup (user: IUser) {
        return this._http({
                    method: 'POST',
                    url: config('url') + config('port') + config('userDriver') + '/new-user',
                    data: user
                });           
    }
    
    // remove cookie
    public signout (user: IUser): void {
        this._http({
            method: 'DELETE',
            url: config('url') + config('port') + config('userDriver') + '/sign-out?name=' + user.name
        });
    }
}