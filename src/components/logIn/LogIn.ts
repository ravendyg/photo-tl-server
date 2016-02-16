/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
export /**
 * LogInController
 */
class LogInController {
    private _user: any;
    
    constructor() {
        this._user = {
            name: '',
            pas: '',
            pasConfirm: '',
            rem: false
        }
    }
    
    public getUser () {
        return this._user;
    }
}