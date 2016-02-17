/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
    
/**
 * UserMenuController
 */
export class UserMenuController {
    
    private _userStore: any;
    private _userActions: any;
    private _notUserActions: any;
    private _users: any [];
    private _self: any;
    
    constructor(userStore, userDataStore, userActions) {
        this._self = this;
        this._userStore = userStore;
        this._userActions = userActions;
        
        this.resetItems();
        
        userStore.addListener( (q) => this.resetItems() );
    }
    
    public resetItems () {
        this._users = this._userStore.users();
    }
    
    public getUsers () {
        return this._users;
    }
    
    public selectUser (userId: number) {
        this._userActions.selectUser(userId);
    }
    
    public deleteUser (userId: number) {
        this._userActions.deleteUser(userId);
    }
}
// angular.module('photoAlbum')
//     .controller('UserMenuController', UserMenuController);

export /**
 * userWrapperController
 */
class userWrapperController {
    private _mdSidenav: any;
    
    constructor($mdSidenav) {
        this._mdSidenav = $mdSidenav;
    }
    
    public toggleList () {
        this._mdSidenav('left').toggle();
    }
}