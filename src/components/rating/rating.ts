/// <reference path="../../../typings/tsd.d.ts" />

export /**
 * LogInController
 */
class RatingController implements IRatingCtrl {
    protected _rating: number;
    private _ratingRender: any [];
    
    private _listenerIds: number [];
    
    protected _photoId: string;
    
    protected _scope: any;
    protected _imageStore: IImageStoreFactory;
    
    constructor ($scope, imageStore: IImageStoreFactory) {
        this._scope = $scope;
        this._imageStore = imageStore;
        
        this._rating = 0;
        // list of font awesome class endings for different stars
        this._ratingRender = []
        
        this._photoId = this._scope.num;

        // register with the emmiter
        var self = this;
        function _renderRating () {self._renderRating(self);}   // bind to this
        imageStore.addListener(_renderRating)
        
        // unregister
        $scope.$on('$destroy', () => {
            imageStore.removeListener(_renderRating);
        });
        
        // load initial state
        this._renderRating(this);
    }
    
    protected _renderRating (self): void {
        // - reset
        self._ratingRender = [];
        self._getRatingFromImageStore();
        // - recalculate
        for (var i=1; i<=5; i++) {
            if ( i <= Math.floor(self._rating) ) {
                self._ratingRender.push({i, val:``});       
            } else {
                if (i === Math.ceil(self._rating)) {
                    self._ratingRender.push({i, val:`-half-o`});  
                } else {
                    self._ratingRender.push({i, val:`-o`});
                }  
            }
        }
    }
    // get average rating from image store in order to display it
    protected _getRatingFromImageStore () {
        this._rating = this._imageStore.getAverageRating(this._photoId);
    }
}