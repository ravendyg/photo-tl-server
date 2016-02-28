/// <reference path="../typings/tsd.d.ts" />

export /**
 * WrapperController
 */
class WrapperController {
    private _userDataStore: any;
    private _loggedInUser: IUser;
    private _listenerId: number;
    private _state: any;
    
    constructor($scope, $state, socketService, imageService, userService, imageStore, userDataStore) {
        this._userDataStore = userDataStore;
        this._state = $state;
        
        
        // registen with the dispatcher
        var _resetUserInfo = () => this._resetUserInfo; // bind to this
        this._userDataStore.addListener(_resetUserInfo);
        
        // unregister
        $scope.$on('$destroy', () => {
            this._userDataStore.removeListener(_resetUserInfo);
        });
        
        
        // load initial state
        userService.getUserFromMemory();
        this._resetUserInfo();
        var user = this._loggedInUser;
        
        // watch for direct access attempts
        $scope.$on('$stateChangeSuccess', () => {
            if ($state.current.name !== 'photo' && !user.name) {
                // for loggedout only 'photo'
                this._state.go('photo');
            } else if ($state.current.name === 'photo' && user.name) {
                // don't show 'please login' if already logged in
                this._state.go('photo.loggedin-all');
            }
        }); 
        
        this._resetUserInfo();
    }
    
    private _resetUserInfo () {
        this._loggedInUser = this._userDataStore.getLoggedInUser();
        if (this._loggedInUser.name) {
            this._state.go('photo.loggedin-all');
        } else {
            this._state.go('photo');
        }
    }
    
    public getLoggedInUser () {
        return this._loggedInUser;
    }
}