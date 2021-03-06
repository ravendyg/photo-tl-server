import { IWebSocketService } from "./WebSocketService";
import {
    IDeletedComment,
    IPhotoDto,
    IPhotoPatch,
    IRating,
    ICommentDto,
    IViewReport,
} from "../types";

export enum EWSAction {
    NEW_PHOTO = 0,
    RATING_UPDATE = 1,
    PATCH_PHOTO = 2,
    DELETE_PHOTO = 3,
    NEW_COMMENT = 4,
    DELETE_COMMENT = 5,
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

    broadcastAddView: (view: IViewReport) => void;
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
            action: EWSAction.DELETE_COMMENT,
            payload,
        });
    }

    broadcastAddView(payload: IViewReport) {
        this.broadcast({
            action: EWSAction.ADD_VIEW,
            payload,
        });
    }
}
