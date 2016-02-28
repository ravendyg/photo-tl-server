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
        
        var self = this;
        
        // registen with the dispatcher
        function _resetUserInfo () {
            self._resetUserInfo(self);
        }
        this._userDataStore.addListener(_resetUserInfo);
        
        // unregister
        $scope.$on('$destroy', () => {
            this._userDataStore.removeListener(_resetUserInfo);
        });
        
        // load initial state
        userService.getUserFromMemory();
        this._resetUserInfo(this);
        
        // watch for direct access attempts
        $scope.$on('$stateChangeSuccess', () => {
            if ($state.current.name !== 'photo' && !self._loggedInUser.name) {
                // for loggedout only 'photo'
                this._state.go('photo');
            } else if ($state.current.name === 'photo' && self._loggedInUser.name) {
                // don't show 'please login' if already logged in
                this._state.go('photo.loggedin-all');
            }
        }); 
    }
    
    private _resetUserInfo (self) {
        self._loggedInUser = self._userDataStore.getLoggedInUser();
        if (self._loggedInUser.name) {
            self._state.go('photo.loggedin-all');
        } else {
            self._state.go('photo');
        }
    }
    
    public getLoggedInUser () {
        return this._loggedInUser;
    }
}