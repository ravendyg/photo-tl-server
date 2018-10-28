import { IWebSocketService } from "./WebSocketService";
import { IPhotoDto } from "../types";

export enum EWSAction {
    NEW_PHOTO = 1,
}

export interface IDataBus {
    broadcastNewPhoto: (photo: IPhotoDto) => void;
}

export class DataBus implements IDataBus {
    constructor (private webSocketService: IWebSocketService) { }

    broadcastNewPhoto(photo: IPhotoDto) {
        const message = JSON.stringify({
            action: EWSAction.NEW_PHOTO,
            payload: photo,
        });
        this.webSocketService.broadcast(message);
    }
}
