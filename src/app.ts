/* global angular */
/* global $mdThemingProvider */
/* global $mdIconProvider */

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/others.d.ts" />

'use strict';
angular.module( 'photoAlbum', ['ngMaterial', 'ui.router'] )
    .config(function($mdThemingProvider, $mdIconProvider, $httpProvider, $stateProvider, $urlRouterProvider){
        $mdIconProvider
            .icon("share", "./assets/svg/share.svg", 24)
            .icon("menu", "./assets/svg/menu.svg", 24)
            .icon("create", "./assets/svg/create.svg", 24)
            .icon("remove", "./assets/svg/remove.svg", 24)
            .icon("preloader", "./assets/svg/preloader.svg", 48);
            
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
import {ImageStoreFactory} from './stores/ImageStore.ts';
import {UserDataStoreFactory} from './stores/UserDataStore.ts';

// action creators
import {UserActions} from './actionCreators/UserActions.ts';
import {ImageActions} from './actionCreators/ImageActions.ts';
import {ServerActions} from './actionCreators/ServerActions.ts';

// component controllers
import {WrapperController} from './WrapperController.ts';
import {UserPhotoController} from './components/userPhoto/UserPhoto.ts';
import {NoUserController} from './components/noUser/noUser.ts';
import {UserDataController} from './components/userData/UserData.ts';
import {LogInController} from './components/logIn/LogIn.ts';
import {AppToolbarController} from './components/appToolbar/AppToolbar.ts';

// server APIs
import {UserService} from './serverApis/UserService.ts';
import {ImageService} from './serverApis/ImageService.ts';
import {SocketService} from './serverApis/socket-service.ts';

angular.module('photoAlbum')
    .service('dispatcher', EventEmmiter)
    
    // stores
    .factory('imageStore', ImageStoreFactory)
    .factory('userDataStore', UserDataStoreFactory)
    
    // actions
    .service('userActions', UserActions)
    .service('imageActions', ImageActions)
    .service('serverActions', ServerActions)
    // .service('serverActions', ServerActions)
    
    // component controllers
    .controller('WrapperController', WrapperController)
    .controller('UserPhotoController', UserPhotoController)
    .controller('NoUserController', NoUserController)
    .controller('UserDataController', UserDataController)
    .controller('LogInController', LogInController)
    .controller('AppToolbarController', AppToolbarController)
     
     // server APIs
     .service('userService', UserService)
     .service('imageService', ImageService)
     .service('socketService', SocketService)
     ;