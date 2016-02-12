/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
(function () {
    angular.module('photoAlbum')
        .controller('UserMenuController', [
        '$scope', 'userService',
        UserMenuController
    ]);
    function UserMenuController($scope, userService) {
        var self = this;
        $scope.usersList = [];
        userService.getAllUsers()
            .then(function (userList) {
            $scope.usersList = userList;
            $scope.$digest();
        });
        self.selectUser = function (user) {
            userService.setUser(user)
                .then(function (selectedUser) {
                $scope.selectedUser = selectedUser;
                $scope.$digest();
            });
        };
    }
})();

//# sourceMappingURL=../../maps/components/userMenu/UserMenu.js.map
