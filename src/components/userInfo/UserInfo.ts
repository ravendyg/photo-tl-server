/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
class UserInfoController {
    private _userStore: any;
    private _user: any;
    private _$mdBottomSheet: any;
    
    constructor(userStore, $mdBottomSheet) {
        this._userStore = userStore;
        this._$mdBottomSheet = $mdBottomSheet;
        
        this.resetItems();
        
        userStore.addListener( () => {
            this.resetItems();
        });  
    }
    
    public resetItems () {
        this._user = this._userStore.user();
    }
    
    public getUser () {
        return this._user;
    }
    
    public makeContact () {
        this._$mdBottomSheet.show({
            controller: 'UserContactController as ucCtrl',
            templateUrl: 'components/userContact/userContact.html',
            parent: angular.element(document.getElementById('content'))
        });
    }
}
    
angular.module('photoAlbum')
    .controller('UserInfoController', UserInfoController);
