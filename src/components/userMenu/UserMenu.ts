/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
    
/**
 * UserMenuController
 */
export class UserMenuController {
    
    private _userStore: any;
    private _userDataStore: any;
    private _userActions: any;
    private _user: any;
    private _users: any [];
    private _self: any;
    private _listenerId: number;
    
    constructor(userStore, userDataStore, userActions, $scope) {
        this._self = this;
        this._userStore = userStore;
        this._userDataStore = userDataStore;
        this._userActions = userActions;
        
        this.resetItems();
        
        // register with the dispatcher
        this._listenerId = userStore.addListener( () => this.resetItems() );
        
        // unregister
        $scope.$on('$destroy', () => {
            userStore.removeListener(this._listenerId);
        });
    }
    
    private resetItems () {
        this._user = this._userStore.user();
        this._users = this._userStore.users();
    }
    
    public getUsers () {
        return this._users;
    }
    
    public getUser () {
        return this._user;
    }
    
    public selectUser (userId: number) {
        this._userActions.selectUser(userId);
        this._userDataStore.message('selected: ' + userId);
    }
    
    public deleteUser (userId: number) {
        this._userActions.deleteUser(userId);
    }
}
