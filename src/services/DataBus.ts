import { IWebSocketService } from "./WebSocketService";
import {
    IDeletedComment,
    IPhotoDto,
    IPhotoPatch,
    IRating,
    ICommentDto,
} from "../types";

export enum EWSAction {
    NEW_PHOTO = 1,
    RATING_UPDATE = 2,
    PATCH_PHOTO = 3,
    DELETE_PHOTO = 4,
    NEW_COMMENT = 5,
    DELET_COMMENT = 6,
}

export interface IDataBus {
    broadcastNewPhoto: (photo: IPhotoDto) => void;

    broadcastPatchPhoto: (patch: IPhotoPatch) => void;

    broadcastDeletePhoto: (iid: string) => void;

    broadcastRating: (rating: IRating) => void;

    broadcastComment: (comment: ICommentDto) => void;

    broadcastDeleteComment: (deleted: IDeletedComment) => void;
}

export class DataBus implements IDataBus {
    constructor (private webSocketService: IWebSocketService) { }

    broadcastNewPhoto(payload: IPhotoDto) {
        this.webSocketService.broadcast({
            action: EWSAction.NEW_PHOTO,
            payload,
        });
    }

    broadcastPatchPhoto(payload: IPhotoPatch) {
        this.webSocketService.broadcast({
            action: EWSAction.PATCH_PHOTO,
            payload,
        });
    }

    broadcastDeletePhoto(payload: string) {
        this.webSocketService.broadcast({
            action: EWSAction.DELETE_PHOTO,
            payload,
        });
    }

    broadcastRating(payload: IRating) {
        this.webSocketService.broadcast({
            action: EWSAction.RATING_UPDATE,
            payload,
        });
    }

    broadcastComment(payload: ICommentDto) {
        this.webSocketService.broadcast({
            action: EWSAction.NEW_COMMENT,
            payload,
        });
    }

    broadcastDeleteComment(payload: IDeletedComment) {
        this.webSocketService.broadcast({
            action: EWSAction.DELET_COMMENT,
            payload,
        });
    }
}
