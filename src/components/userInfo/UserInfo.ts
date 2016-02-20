/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
export class UserInfoController {
    private _userStore: any;
    private _userActions: any;
    private _user: any;
    // private _$mdBottomSheet: any;
    private _listenerId: number;
    private _state: any;
    
    constructor(userStore, userActions,
                // $mdBottomSheet,
                $scope, $state) {
        this._userStore = userStore;
        this._userActions = userActions;
        // this._$mdBottomSheet = $mdBottomSheet;
        this._state = $state;
        
        this.resetItems();
        
        // register with the dispatcher
        this._listenerId = userStore.addListener( () => { this.resetItems(); } );  
        
        // unregister
        $scope.$on('$destroy', () => {
            userStore.removeListener(this._listenerId);
            // this._$mdBottomSheet.hide();
        });
        
    }
    
    private resetItems () {
        this._user = this._userStore.user();
        if (!this._user.name) {
            console.log('loggedout');
            this._state.transitionTo('photo');    
        } 
    }
    
    public getUser () {
        return this._user;
    }
    
    // public makeContact () {
    //     this._$mdBottomSheet.show({
    //         controller: 'UserContactController as ucCtrl',
    //         templateUrl: 'components/userContact/userContact.html',
    //         parent: angular.element(document.getElementById('content'))
    //     });
    // }
    
    public deleteUser (userId: number) {
        this._userActions.deleteUser(userId);
    }
}