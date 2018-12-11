import { EWSAction, IDataBus } from './DataBus';
import {IDbService} from './DbService';
import {
    IDTOWrapper,
    INewMessageRequest,
    IRatingUpdateRequest,
    IDeleteMessageRequest,
    IUser,
} from '../types';
import { mapCommentToDto } from '../utils/mappers';

type TMessage<P> = {
    action: EWSAction;
    payload: P;
}

// TODO: implement
function unmarshal(_rawData: Buffer): TMessage<any> {
    return {
        action: EWSAction.DELETE_COMMENT,
        payload: {
            iid: 'sdfsdf',
        },
    };
}

export interface IAsyncPropcessor {
    process: (
        message: TMessage<any> | Buffer,
        user: IUser,
    ) => Promise<IDTOWrapper>;
}

export class AsyncProcessor implements IAsyncPropcessor {
    constructor(
        private dbService: IDbService,
        private dataBus: IDataBus,
    ) {}

    process = (
        rawMessage: TMessage<any> | Buffer,
        user: IUser,
    ) => {
        let message: TMessage<any>;
        if (Buffer.isBuffer(rawMessage)) {
            message = unmarshal(rawMessage);
        } else {
            message = rawMessage;
        }

        switch (message.action) {
            case EWSAction.RATING_UPDATE: {
                return this.processRatingUpdate(message, user);
            }

            case EWSAction.NEW_COMMENT: {
                return this.processNewMessage(message, user);
            }

            case EWSAction.DELETE_COMMENT: {
                return this.processDeleteMessage(message, user);
            }

            default:
                // @ts-ignore
                return Promise.resolve({
                    status: 400,
                    error: 'Action not found',
                });
        }
    }

    // TODO: refactor common verification logic
    private async processRatingUpdate(
        message: TMessage<IRatingUpdateRequest>,
        user: IUser,
    // @ts-ignore
    ): Promise<IDTOWrapper> {
        const {
            payload: {
                iid,
                rating,
            },
        } = message;

        if (!iid || !rating) {
            return {
                error: 'Missing data',
                status: 400,
            };
        }

        try {
            const createdRating = await this.dbService.createRating(user, iid, rating)
            this.dataBus.broadcastRating(createdRating);
            return {
                payload: '',
                status: 200,
            };
        } catch (err) {
            console.error(err);
            return {
                status: 500,
                error: 'Server error',
            };
        }
    }

    private async processNewMessage(
        message: TMessage<INewMessageRequest>,
        user: IUser,
    // @ts-ignore
    ): Promise<IDTOWrapper> {
        const {
            payload: {
                iid,
                text,
            },
        } = message;

        if (!iid || !text) {
            return {
                error: 'Missing data',
                status: 400,
            };
        }

        try {
            const comment = await this.dbService.createComment(user, iid, text);
            const commentDto = mapCommentToDto(comment);
            this.dataBus.broadcastComment(commentDto);
            return {
                payload: '',
                status: 200,
            };
        } catch (err) {
            console.error(err);
            return {
                status: 500,
                error: 'Server error',
            };
        }
    }

    private async processDeleteMessage(
        message: TMessage<IDeleteMessageRequest>,
        user: IUser,
    // @ts-ignore
    ): Promise<IDTOWrapper> {
        const {
            payload: {
                cid,
            },
        } = message;

        if (!cid) {
            return {
                error: 'Missing data',
                status: 400,
            };
        }

        try {
            const iid = await this.dbService.deleteComment(cid, user);
            if (iid) {
                this.dataBus.broadcastDeleteComment({ cid, iid });
                return {
                    payload: '',
                    status: 200,
                };
            } else {
                return {
                    status: 404,
                    error: 'Comment not found',
                };
            }
        } catch (err) {
            console.error(err);
            return {
                status: 500,
                error: 'Server error',
            };
        }
    }
}
