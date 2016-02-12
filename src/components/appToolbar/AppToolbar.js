/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
(function () {
    angular.module('photoAlbum')
        .controller('AppToolbarController', [
        '$scope', '$mdDialog', '$mdMedia', 'userService',
        AppToolbarController
    ]);
    function AppToolbarController($scope, $mdDialog, $mdMedia, userService) {
        var self = this;
        self.loggedInUser = userService.loggedInUser;
        self.signIn = function ($event) {
            console.log(0);
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: 'LogInController as lgCtrl',
                templateUrl: 'components/logIn/logIn.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            })
                .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };
    }
})();

//# sourceMappingURL=../../maps/components/appToolbar/AppToolbar.js.map
