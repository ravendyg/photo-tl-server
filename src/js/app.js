/// <reference path="../../typings/tsd.d.ts" />
(function () {
    angular.module('photoAlbum', ['ngMaterial', 'ui.router'])
        .config(function ($mdIconProvider) {
        // Register the user `avatar` icons
        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128);
    });
})();

//# sourceMappingURL=../maps/js/app.js.map
