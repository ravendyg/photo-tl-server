/* global angular */
/* global $mdThemingProvider */
/* global $mdIconProvider */

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/others.d.ts" />

'use strict';
angular.module( 'photoAlbum', ['ngMaterial', 'ui.router'] )
    .config(function($mdThemingProvider, $mdIconProvider, $httpProvider, $stateProvider, $urlRouterProvider){
        // Register the user `avatar` icons
        $mdIconProvider
            .icon("share", "./assets/svg/share.svg", 24)
            .icon("menu", "./assets/svg/menu.svg", 24)
            .icon("create", "./assets/svg/create.svg", 24)
            .icon("remove", "./assets/svg/remove.svg", 24)
            .defaultIconSet("./assets/svg/avatars.svg", 128);
            
        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .accentPalette('red');
        $stateProvider
            .state('photo', {
                url: '/',
                views: {
                    'toolbar': {
                        templateUrl: 'components/appToolbar/appToolbar.html',
                        controller: 'AppToolbarController as apTbCtrl'
                    },
                    'content': {
                        templateUrl: 'components/noUser/noUser.html',
                        controller: 'NoUserController as noCtrl'
                    }
                }
            })
            .state('photo.loggedin', {
                url: 'loggedin/photo',
                views: {
                    'content@': {
                        templateUrl: 'components/userPhoto/userPhoto.html',
                        controller: 'UserPhotoController as usPhCtrl'
                    }
                }
            })
            .state('photo.user-data', {
                url: 'loggedin/user-data',
                views: {
                    'content@': {
                        templateUrl: 'components/userData/userData.html',
                        controller: 'UserDataController as usDatCtrl'
                    }
                }
            });
            
        $urlRouterProvider.otherwise('/');

    });
    
import {EventEmmiter} from './EventEmmiter.ts';

// stores
import {UserStoreFactory} from './stores/UserStore.ts';
import {ImageStoreFactory} from './stores/ImageStore.ts';
import {UserDataStoreFactory} from './stores/UserDataStore.ts';

// action creators
import {UserActions} from './actionCreators/UserActions.ts';
// import {ServerActions} from './actionCreators/ServerActions.ts';

// component controllers
// import {UserMenuController} from './components/userMenu/UserMenu.ts';
import {WrapperController} from './WrapperController.ts';
import {UserPhotoController} from './components/userPhoto/UserPhoto.ts';
import {NoUserController} from './components/noUser/noUser.ts';
import {UserDataController} from './components/userData/UserData.ts';
import {LogInController} from './components/logIn/LogIn.ts';
import {AppToolbarController} from './components/appToolbar/AppToolbar.ts';

// server APIs
import {UserService} from './serverApis/UserService.ts';
import {ImageService} from './serverApis/ImageService.ts';

angular.module('photoAlbum')
    .service('dispatcher', EventEmmiter)
    
    // stores
    .factory('userStore', UserStoreFactory)
    .factory('imageStore', ImageStoreFactory)
    .factory('userDataStore', UserDataStoreFactory)
    
    // actions
    .service('userActions', UserActions)
    // .service('serverActions', ServerActions)
    
    // component controllers
    // .controller('UserMenuController', UserMenuController)
    .controller('WrapperController', WrapperController)
    .controller('UserPhotoController', UserPhotoController)
    .controller('NoUserController', NoUserController)
    .controller('UserDataController', UserDataController)
    .controller('LogInController', LogInController)
    .controller('AppToolbarController', AppToolbarController)
    
    // component directives
    // .directive('userMenu', function () {
    //      return {
    //          controller: 'UserMenuController as usMenCtrl',
    //          templateUrl: 'components/userMenu/userMenu.html',
    //          scope: {}
    //         // template: require('./components/userMenu/userMenu.html')
    //      }
    //  })
    //  .directive('userInfo', function () {
    //      return {
    //          restrict: 'A',
    //          controller: 'UserInfoController as usInfCtrl',
    //          templateUrl: 'components/userInfo/userInfo.html',
    //          scope: {}
    //      }
    //  })
    //  .directive('appToolbar', function () {
    //      return {
    //         restrict: 'E',
    //         replace: true,
    //         controller: 'AppToolbarController as apTbCtrl',
    //         templateUrl: 'components/appToolbar/appToolbar.html',
    //         scope: {}
    //      }
    //  })
     
     // server APIs
     .service('userService', UserService)
     .service('imageService', ImageService)
     ;