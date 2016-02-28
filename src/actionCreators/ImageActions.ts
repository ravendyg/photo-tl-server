/// <reference path="./../../typings/interfaces.d.ts" />

export /**
 * UserActions
 */
class ImageActions {
    private _dispatcher: IDispatcher;
    
    constructor(dispatcher: IDispatcher) {
        this._dispatcher = dispatcher;
    }
    
    public deletePhoto (photoId: number) {
        this._dispatcher.dispatch({
           type: "DELETE_PHOTO",
           photoId: photoId 
        });
    }    
    
}