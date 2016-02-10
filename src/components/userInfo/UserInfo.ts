/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
(function(){
angular.module('photoAlbum')
     .controller('UserInfoController', [
        '$scope', 'userService', '$mdSidenav', '$mdBottomSheet', '$log',
        UserInfoController
     ]);

function UserInfoController ($scope, userService) {
    var self = this;

    $scope.selectedUser = {};
    $scope.selectedUser = userService.getUser()
        .then( selectedUser => {
            $scope.selectedUser = selectedUser;
            $scope.$digest();
        });
        
    self.show = function () {
        console.log($scope.selectedUser);
    }
}
})();