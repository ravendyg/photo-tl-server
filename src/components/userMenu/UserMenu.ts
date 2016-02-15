/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
(function(){
    
/**
 * UserMenuController
 */
class UserMenuController {
    
    private _userStore: any;
    private _userActions: any;
    private _users: any [];
    private _self: any;
    
    constructor(userStore, userActions) {
        this._self = this;
        this._userStore = userStore;
        this._userActions = userActions;
        
        this.resetItems();
        
        // userStore.addListener( () => this.resetItems() );
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
}
angular.module('photoAlbum')
    //  .controller('UserMenuController', [
    //     '$scope', 'userService',
    //     UserMenuController
    //  ]);
    .controller('UserMenuController', UserMenuController);

// function UserMenuController ($scope, userService) {
//     var self = this;
    
//     $scope.usersList = [];
//     userService.getAllUsers()
//         .then( userList => {
//             $scope.usersList = userList;
//             $scope.$digest();
//         });
        
//     self.selectUser = function (user) {
//         userService.setUser(user)
//             .then( (selectedUser) => {
//                 $scope.selectedUser = selectedUser;
//                 $scope.$digest();
//             });
//     }
// }
})();