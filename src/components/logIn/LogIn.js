/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
(function () {
    angular.module('photoAlbum')
        .controller('LogInController', [
        '$scope', '$mdDialog', '$mdMedia', 'userService',
        LogInController
    ]);
    function LogInController($scope, userService) {
        var self = this;
        self.user = {
            name: '',
            pas: '',
            pasConfirm: '',
            rem: false
        };
    }
})();

//# sourceMappingURL=../../maps/components/logIn/LogIn.js.map
