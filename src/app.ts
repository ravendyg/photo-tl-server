/// <reference path="../typings/tsd.d.ts" />
(function(){
angular.module( 'photoAlbum', ['ngMaterial', 'ui.router'] )
    .config(function($mdThemingProvider, $mdIconProvider ){
        // Register the user `avatar` icons
        $mdIconProvider
            .icon("share", "./assets/svg/share.svg", 24)
            .icon("menu", "./assets/svg/menu.svg", 24)
            .defaultIconSet("./assets/svg/avatars.svg", 128);
            
        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .accentPalette('red');
    });
})();