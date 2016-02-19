/* global angular */
/* global $mdThemingProvider */
/* global $mdIconProvider */

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/others.d.ts" />

'use strict';
angular.module( 'photoAlbum', ['ngMaterial', 'ui.router'] )
    .config(function($mdThemingProvider, $mdIconProvider, $httpProvider){
        // Register the user `avatar` icons
        $mdIconProvider
            .icon("share", "./assets/svg/share.svg", 24)
            .icon("menu", "./assets/svg/menu.svg", 24)
            .defaultIconSet("./assets/svg/avatars.svg", 128);
            
        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .accentPalette('red');
            
            // $httpProvider.defaults.withCredentials = true;
    });
    
import {EventEmmiter} from './EventEmmiter.ts';

// stores
import {UserStoreFactory} from './stores/UserStore.ts';
import {UserDataStoreFactory} from './stores/UserDataStore.ts';

// action creators
import {UserActions} from './actionCreators/UserActions.ts';
// import {ServerActions} from './actionCreators/ServerActions.ts';

// component controllers
// import {UserMenuController} from './components/userMenu/UserMenu.ts';
import {WrapperController} from './WrapperController.ts';
import {UserInfoController} from './components/userInfo/UserInfo.ts';
// import {UserContactController} from './components/userContact/UserContact.ts';
import {LogInController} from './components/logIn/LogIn.ts';
import {AppToolbarController} from './components/appToolbar/AppToolbar.ts';

// server APIs
import {UserService} from './serverApis/UserService.ts';

angular.module('photoAlbum')
    .service('dispatcher', EventEmmiter)
    
    // stores
    .factory('userStore', UserStoreFactory)
    .factory('userDataStore', UserDataStoreFactory)
    
    // actions
    .service('userActions', UserActions)
    // .service('serverActions', ServerActions)
    
    // component controllers
    // .controller('UserMenuController', UserMenuController)
    .controller('UserWrapperController', WrapperController)
    .controller('UserInfoController', UserInfoController)
    // .controller('UserContactController', UserContactController)
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
     .directive('userInfo', function () {
         return {
             restrict: 'A',
             controller: 'UserInfoController as usInfCtrl',
             templateUrl: 'components/userInfo/userInfo.html',
             scope: {}
         }
     })
     .directive('appToolbar', function () {
         return {
            restrict: 'E',
            replace: true,
            controller: 'AppToolbarController as apTbCtrl',
            templateUrl: 'components/appToolbar/appToolbar.html',
            scope: {}
         }
     })
     
     // server APIs
     .service('userService', UserService)
     ;