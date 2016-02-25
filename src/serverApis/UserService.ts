/// <reference path="./../interfaces.d.ts" />
import {config} from './../config.ts';

export class UserService {
    private _http: any;
    private _q: any;
    private _socketService: ISocketService;
    private _userActions: IUserActions;
    private _loggedInUser: any;
    
    constructor ($http, $q, socketService, userActions: IUserActions) {
        this._http = $http;
        this._q = $q;
        this._socketService = socketService;
        this._userActions = userActions;
window.socketService = socketService;
    }
    
    public getUserFromMemory () {
        var deferred = this._q.defer();
        // check session storage
        var cookies: string [] = document.cookie.split(';');
        var name = cookies.filter( (obj) => obj.indexOf('uId=') > -1 )[0];
        if (name) {
            // already logged in
            // verify
            this._http({
                method: 'GET',
                url: config('url') + config('port') + config('userDriver') + '/verify-user',
                params: {name: name.split('%7C')[0].split('=')[1]}
            }).then( (response) => {
                deferred.resolve(response.data.name);
                this._socketService.connect(config('url') + config('port'));
                this._userActions.confirmed();
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
    
    // generic sign up or in operation
    private _signUpIn (user: IUser, options) {
        var deferred = this._q.defer();
        var loggedInUser =  {
                    name: '',
                    pas: '',
                    pas2: '',
                    rem: false,
                    error: ''
                };
        this._http(options).then( (resp) => {
            loggedInUser.name = resp.data.name;
            deferred.resolve(loggedInUser);
            this._socketService.connect(config('url') + config('port'));
        },
        (resp) => {
            console.log(resp);
            if (resp.data) {
                switch (resp.data.error) {
                    case 'wrong password':
                        loggedInUser.error = 'Неверный пароль';
                    break;
                    case 'wrong username':
                        loggedInUser.error = 'Неверное имя пользователя';
                    break;
                }
            } else {
                loggedInUser.error = 'Неизвестная ошибка';
            }
            deferred.resolve(loggedInUser);
        });
                
        return deferred.promise;
    }
    
    public signin (user: IUser) {
        return this._signUpIn(user, {
                    method: 'GET',
                    url: config('url') + config('port') + config('userDriver') + '/sign-in',
                    params: user
                });
    }
    
    public signup (user: IUser) {
        return this._signUpIn(user, {
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
        this._socketService.disconnect();;
    }
}