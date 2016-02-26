/// <reference path="./../interfaces.d.ts" />

export /**
 * ServerActions
 */
class ServerActions {
    private _dispatcher: IEventEmmiter;
    
    constructor(dispatcher: IEventEmmiter) {
        this._dispatcher = dispatcher;
    }
    
    public deletePhoto (photoId: string) {
        this._dispatcher.emit({
           type: "DELETE_PHOTO_SERVER",
           photoId 
        });
    }
    
    public uploadPhoto (image: IImage) {
        this._dispatcher.emit({
           type: "UPLOAD_PHOTO_SERVER",
           image 
        });
    }
    
    public votePhoto (newRating: INewRating) {
        this._dispatcher.emit({
           type: "VOTE_PHOTO_SERVER",
           newRating 
        });
    }
}