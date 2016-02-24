/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/others.d.ts" />

export /**
 * WrapperController
 */
class WrapperController {
    private _mdSidenav: any;
    private _userDataStore: any;
    private _loggedInUser: IUser;
    private _listenerId: number;
    private _state: any;
    
    constructor($scope, $mdSidenav, $state, userDataStore) {
        this._mdSidenav = $mdSidenav;
        this._userDataStore = userDataStore;
        this._state = $state;
        
        this.resetUserInfo();
        
        // registen with the dispatcher
        this._listenerId = this._userDataStore.addListener( () => {
            this.resetUserInfo();
        });
        
        // unregister
        $scope.$on('$destroy', () => {
            this._userDataStore.removeListener(this._listenerId);
        });
        
        // watch for direct access attempts
        $scope.$on('$stateChangeSuccess', () => {
            if ($state.current.name !== 'photo' && !this._loggedInUser.name) {
                // for loggedout only 'photo'
                this._state.go('photo');
            } else if ($state.current.name === 'photo' && this._loggedInUser.name) {
                // don't show 'please login' if already logged in
                this._state.go('photo.loggedin');
            }
        });
        
    }
    
    private resetUserInfo () {
        this._loggedInUser = this._userDataStore.getLoggedInUser();
        if (this._loggedInUser.name) {
            this._state.go('photo.loggedin');
        } else {
            this._state.go('photo');
        }
    }
    
    public getLoggedInUser () {
        return this._loggedInUser;
    }
    
    
    
    public toggleList () {
        this._mdSidenav('left').toggle();
    }
}