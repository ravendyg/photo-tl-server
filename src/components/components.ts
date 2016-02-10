/// <reference path="../../typings/tsd.d.ts" />
(function(){
angular.module('photoAlbum')
    .directive('userMenu', function () {
         return {
             controller: 'UserMenuController as usMenCtrl',
             templateUrl: 'components/userMenu/userMenu.html'
         }
     })
     .directive('userInfo', function () {
         return {
             controller: 'UserInfoController as usInfCtrl',
             templateUrl: 'components/userInfo/userInfo.html'
         }
     });
})();