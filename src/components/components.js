/// <reference path="../../typings/tsd.d.ts" />
(function () {
    angular.module('photoAlbum')
        .directive('userMenu', function () {
        return {
            controller: 'UserMenuController as usMenCtrl',
            templateUrl: 'components/userMenu/userMenu.html'
        };
    })
        .directive('userInfo', function () {
        return {
            controller: 'UserInfoController as usInfCtrl',
            templateUrl: 'components/userInfo/userInfo.html'
        };
    })
        .directive('userWrapper', function () {
        return {
            controller: 'UserWrapperController as usWrCtrl',
            templateUrl: 'components/userWrapper/userWrapper.html'
        };
    })
        .controller('UserWrapperController', ['$mdSidenav', userWrapperController]);
    function userWrapperController($mdSidenav) {
        var self = this;
        self.toggleList = function () {
            $mdSidenav('left').toggle();
        };
    }
})();

//# sourceMappingURL=../maps/components/components.js.map
