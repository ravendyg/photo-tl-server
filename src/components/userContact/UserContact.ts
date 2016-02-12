/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
(function(){
    angular.module('photoAlbum')
        .controller('UserContactController', [
            '$scope', 'userService',
            UserContactController
        ]);

    function UserContactController ($mdBottomSheet) {
        var self = this;
        
        self.items = [
            {name: 'Phone', icon: 'phone',  icon_url: 'assets/svg/phone.svg'},
            {name: 'Twitter', icon: 'twitter',  icon_url: 'assets/svg/twitter.svg'},
            {name: 'Google+', icon: 'google_plus',  icon_url: 'assets/svg/google_plus.svg'},
            {name: 'Hangout', icon: 'hangouts',  icon_url: 'assets/svg/hangouts.svg'}
        ];
        
        self.contactUser = function (action) {
            $mdBottomSheet.hide(action);
        };
    }
})();