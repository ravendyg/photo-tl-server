/// <reference path="../../typings/tsd.d.ts" />
angular.module( 'photoAlbum', ['ngMaterial', 'ui.router'] )
    .config(function( $mdIconProvider ){
        // Register the user `avatar` icons
        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128);
    });