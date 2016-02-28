/// <reference path="./../../typings/interfaces.d.ts" />

export /**
 * ServerActions
 */
class ServerActions {
    private _dispatcher: IDispatcher;
    
    constructor(dispatcher: IDispatcher) {
        this._dispatcher = dispatcher;
    }
    
    public deletePhoto (photoId: string) {
        this._dispatcher.dispatch({
           type: "DELETE_PHOTO_SERVER",
           photoId 
        });
    }
    
    public uploadPhoto (image: IImage) {
        this._dispatcher.dispatch({
           type: "UPLOAD_PHOTO_SERVER",
           image 
        });
    }
    
    public votePhoto (newRating: INewRating) {
        this._dispatcher.dispatch({
           type: "VOTE_PHOTO_SERVER",
           newRating 
        });
    }
    
    public downloadPhotos (images: IImage []) {
        this._dispatcher.dispatch({
           type: "DOWNLOAD_PHOTO_SERVER",
           images 
        });
    }
}