import { IWebSocketService } from "./WebSocketService";
import {
    IDeletedComment,
    IPhotoDto,
    IPhotoPatch,
    IRating,
    ICommentDto,
} from "../types";

export enum EWSAction {
    NEW_PHOTO = 0,
    RATING_UPDATE = 1,
    PATCH_PHOTO = 2,
    DELETE_PHOTO = 3,
    NEW_COMMENT = 4,
    DELET_COMMENT = 5,
    ADD_VIEW = 6,
}

export interface IDataBus {
    setPublisher: (webSocketService: IWebSocketService) => void;

    broadcastNewPhoto: (photo: IPhotoDto) => void;

    broadcastPatchPhoto: (patch: IPhotoPatch) => void;

    broadcastDeletePhoto: (iid: string) => void;

    broadcastRating: (rating: IRating) => void;

    broadcastComment: (comment: ICommentDto) => void;

    broadcastDeleteComment: (deleted: IDeletedComment) => void;

    broadcastAddView: (iid: string) => void;
}

export class DataBus implements IDataBus {
    private broadcast: (message: any) => void = () => {};

    setPublisher(webSocketService: IWebSocketService) {
        this.broadcast = webSocketService.broadcast;
    }

    broadcastNewPhoto(payload: IPhotoDto) {
        this.broadcast({
            action: EWSAction.NEW_PHOTO,
            payload,
        });
    }

    broadcastPatchPhoto(payload: IPhotoPatch) {
        this.broadcast({
            action: EWSAction.PATCH_PHOTO,
            payload,
        });
    }

    broadcastDeletePhoto(payload: string) {
        this.broadcast({
            action: EWSAction.DELETE_PHOTO,
            payload,
        });
    }

    broadcastRating(payload: IRating) {
        console.log(this.broadcast)
        this.broadcast({
            action: EWSAction.RATING_UPDATE,
            payload,
        });
    }

    broadcastComment(payload: ICommentDto) {
        this.broadcast({
            action: EWSAction.NEW_COMMENT,
            payload,
        });
    }

    broadcastDeleteComment(payload: IDeletedComment) {
        this.broadcast({
            action: EWSAction.DELET_COMMENT,
            payload,
        });
    }

    broadcastAddView(payload: string) {
        this.broadcast({
            action: EWSAction.ADD_VIEW,
            payload,
        });
    }
}
