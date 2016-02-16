export class UserService {
    private _http: any;
    private _loggedInUser: any;
    
    constructor ($http) {
        this._http = $http;
        
        this._loggedInUser = null;
    }
    
    public loggedInUser () {
        return this._loggedInUser;
    }
}