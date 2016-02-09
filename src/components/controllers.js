/// <reference path="../../typings/tsd.d.ts" />
angular.module('photoAlbum', ['ngMaterial', 'ui.router', 'users'])
    .config(function ($mdIconProvider) {
    $mdIconProvider
        .defaultIconSet('assets/svg/avatars.svg', 128);
    // $stateProvider
    // .when('/dashboard', {
    //     templateUrl: 'views/dashboard.html',
    //     controller: 'dashboardController',
    //     controllerAs: 'dashCtrl'
    // })
    // .otherwise('/dashboard');
});

//# sourceMappingURL=../src/maps/components/controllers.js.map
