/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
/// <reference path="../../interfaces.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
export /**
 * LogInController
 */
class RatingController implements IRatingCtrl {
    protected _rating: number;
    private _ratingRender: any [];
    
    private _listenerIds: number [];
    
    protected _photoId: string;
    
    protected _scope: any;
    protected _imageStore: IImageStore;
    
    constructor ($scope, imageStore: IImageStore) {
        this._scope = $scope;
        this._imageStore = imageStore;
        
        this._rating = 0;
        // list of font awesome class endings for different stars
        this._ratingRender = []
        
        this._photoId = this._scope.num;

        // register with the dispatcher
        this._listenerIds = [];
        this._listenerIds.push(imageStore.addListener( () => { this._renderRating(); } ))
        
        // unregister
        $scope.$on('$destroy', () => {
            imageStore.removeListener(this._listenerIds[0]);
        });
        
        // reset
        this._renderRating();
    }
    
    protected _renderRating (): void {
        // - reset
        this._ratingRender = [];
        this._getRatingFromImageStore();
        // - recalculate
        for (var i=1; i<=5; i++) {
            if ( i <= Math.floor(this._rating) ) {
                this._ratingRender.push({i, val:``});       
            } else {
                if (i === Math.ceil(this._rating)) {
                    this._ratingRender.push({i, val:`-half-o`});  
                } else {
                    this._ratingRender.push({i, val:`-o`});
                }  
            }
        }
    }
    // get average rating from image store in order to display it
    protected _getRatingFromImageStore () {
        this._rating = this._imageStore.getAverageRating(this._photoId);
    }
}