/// <reference path="../../../typings/tsd.d.ts" />

import {RatingController} from './rating.ts';

export /**
 * LogInController
 */
class RatingClickableController extends RatingController {
    
    private _socketService: ISocketService;
    private _user: string;
    
    
    constructor ($scope, socketService: ISocketService, imageStore: IImageStoreFactory) {
        super($scope, imageStore);
        
        this._socketService = socketService;
        
        this._user = $scope.user;
        
        // // get rating for the currently loggedin user
        // var userRating = JSON.parse(this._scope.rating).filter( (obj) => {
        //     return obj.user && obj.user === this._scope.user
        // })[0];
        // // if it exists, otherwise it's 0
        // this._rating = (userRating) ? userRating.val : 0;
        // // rerender rating
        // this._renderRating();
        
    }
    
    public show ($event) {
        console.log($event);
        console.log($event.target.className);
        // check for click target correctness
        if ($event.target.className.match(/fa fa-star/)) {
            this._socketService.vote($event.target.dataset.id, this._photoId);
        }   
    }
    
    // override default call to the image store and get user specific rating
    protected _getRatingFromImageStore () {
        this._rating = this._imageStore.getUserRating(this._photoId, this._user);
    }
}