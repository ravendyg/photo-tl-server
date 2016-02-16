/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 

/**
 * UserContactController
 */
export class UserContactController {
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
    
    // public getItems () {
    //     return [
    public items = [
            {name: 'Phone', icon: 'phone',  icon_url: 'assets/svg/phone.svg'},
            {name: 'Twitter', icon: 'twitter',  icon_url: 'assets/svg/twitter.svg'},
            {name: 'Google+', icon: 'google_plus',  icon_url: 'assets/svg/google_plus.svg'},
            {name: 'Hangout', icon: 'hangouts',  icon_url: 'assets/svg/hangouts.svg'}
        ];
    // }
    
    public contactUser = function (action) {
        this._$mdBottomSheet.hide(action);
    };
}    

// angular.module('photoAlbum')
//     .controller('UserContactController', UserContactController);