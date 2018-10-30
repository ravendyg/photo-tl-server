import { IWebSocketService } from "./WebSocketService";
import { IPhotoDto, IRating } from "../types";

export enum EWSAction {
    NEW_PHOTO = 1,
    RATING_UPDATE = 2,
}

export interface IDataBus {
    broadcastNewPhoto: (photo: IPhotoDto) => void;

    broadcastRating: (rating: IRating) => void;
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

    broadcastRating(rating: IRating) {
        const message = JSON.stringify({
            action: EWSAction.RATING_UPDATE,
            payload: rating,
        });
        this.webSocketService.broadcast(message);
    }
}
