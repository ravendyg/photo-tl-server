/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/others.d.ts" />

export /**
 * userWrapperController
 */
class WrapperController {
    private _mdSidenav: any;
    private _userDataStore: any;
    private _loggedInUser: IUser;
    private _listenerId: number;
    
    constructor($scope, $mdSidenav, userDataStore) {
        this._mdSidenav = $mdSidenav;
        this._userDataStore = userDataStore;
        
        this.resetUserInfo();
        
        // registen with the dispatcher
        this._listenerId = this._userDataStore.addListener( () => {
            this.resetUserInfo();
        });
        
        // unregister
        $scope.$on('$destroy', () => {
            this._userDataStore.removeListener(this._listenerId);
        });
    }
    
    private resetUserInfo () {
        this._loggedInUser = this._userDataStore.getLoggedInUser();
console.log(this._loggedInUser);
    }
    
    public getLoggedInUser () {
        return this._loggedInUser;
    }
    
    
    
    public toggleList () {
        this._mdSidenav('left').toggle();
    }
}