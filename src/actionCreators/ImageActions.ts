/// <reference path="./../interfaces.d.ts" />

export /**
 * UserActions
 */
class ImageActions {
    private _dispatcher: IEventEmmiter;
    
    constructor(dispatcher: IEventEmmiter) {
        this._dispatcher = dispatcher;
    }
    
    public deletePhoto (photoId: number) {
        this._dispatcher.emit({
           type: "DELETE_PHOTO",
           photoId: photoId 
        });
    }    
    
}