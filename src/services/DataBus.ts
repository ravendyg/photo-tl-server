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
        this.webSocketService.broadcast({
            action: EWSAction.NEW_PHOTO,
            payload: photo,
        });
    }

    broadcastRating(rating: IRating) {
        this.webSocketService.broadcast({
            action: EWSAction.RATING_UPDATE,
            payload: rating,
        });
    }
}
