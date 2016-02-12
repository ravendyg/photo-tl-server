/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
(function () {
    angular.module('photoAlbum')
        .controller('UserInfoController', [
        '$scope', 'userService', '$mdBottomSheet',
        UserInfoController
    ]);
    function UserInfoController($scope, userService, $mdBottomSheet) {
        var self = this;
        $scope.selectedUser = {};
        $scope.selectedUser = userService.getUser()
            .then(function (selectedUser) {
            $scope.selectedUser = selectedUser;
            $scope.$digest();
        });
        self.makeContact = function () {
            $mdBottomSheet.show({
                controller: 'UserContactController as ucCtrl',
                templateUrl: 'components/userContact/userContact.html',
                parent: angular.element(document.getElementById('content'))
            });
        };
    }
})();

//# sourceMappingURL=../../maps/components/userInfo/UserInfo.js.map
