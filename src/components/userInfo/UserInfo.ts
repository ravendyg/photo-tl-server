/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
(function(){
    
    class UserInfoController {
        private _userStore: any;
        private _user: any;
        private _$mdBottomSheet: any;
        
        constructor($scope, userStore, $mdBottomSheet) {
            this._userStore = userStore;
            this._$mdBottomSheet = $mdBottomSheet;
            
            this.resetItems();
            
            userStore.addListener( () => {
                this.resetItems();
                $scope.$digest();
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
        // .controller('UserInfoController', [
        //     '$scope', 'userService', '$mdBottomSheet',
        //     UserInfoController
        // ]);
        .controller('UserInfoController', UserInfoController);

    // function UserInfoController ($scope, userService, $mdBottomSheet) {
    //     var self = this;

    //     $scope.selectedUser = {};
        
    //     $scope.selectedUser = userService.getUser()
    //         .then( selectedUser => {
    //             $scope.selectedUser = selectedUser;
    //             $scope.$digest();
    //         });
     
    //     self.makeContact = function () {
    //         $mdBottomSheet.show({
    //             controller: 'UserContactController as ucCtrl',
    //             templateUrl: 'components/userContact/userContact.html',
    //             parent: angular.element(document.getElementById('content'))
    //         });
    //     }
    // }
    /**
     * UserInfoController
     */
    
})();