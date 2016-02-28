/// <reference path="./../../typings/interfaces.d.ts" />

export /**
 * UserActions
 */
class StoresActions {
    private _dispatcher: IDispatcher;
    
    constructor(dispatcher: IDispatcher) {
        this._dispatcher = dispatcher;
    }
    
    public imageStoreReport () {
        this._dispatcher.dispatch({
           type: "IMAGE_STORE_ONLINE"
        });
    }    
    
}