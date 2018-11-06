import * as express from 'express';
import * as Express from 'express';
import { IDbService } from '../services/DbService';
import {  } from '../types';
import { IDataBus } from '../services/DataBus';
import { mapCommentToDto } from '../utils/mappers';

export function createCommentRouter(
    getUser: Express.RequestHandler,
    dbService: IDbService,
    dataBus: IDataBus,
) {
    const router = express.Router();

    router.get('/:iid', getUser, async (req: Express.Request, res: Express.Response) => {
        const {
            metadata: {
                user
            },
        } = req;
        if (!user) {
            return res.json({
                error: 'Unauthorized',
                status: 403,
            });
        }

        const iid = req.params.iid;
        if (!iid) {
            return res.json({
                error: 'Missing image id',
                status: 400,
            });
        }
        try {
            const comments = await dbService.getComments(iid);
            const commentDtos = comments.map(mapCommentToDto);
            return res.json({
                status: 200,
                payload: commentDtos,
            });
        } catch (err) {
            console.error(err);
            return res.json({
                error: 'Server error',
                status: 500,
            });
        }
    });

    router.post('/', getUser, async (req: Express.Request, res: Express.Response) => {
        const {
            metadata: {
                user
            },
        } = req;
        if (!user) {
            return res.json({
                error: 'Unauthorized',
                status: 403,
            });
        }
        if (!req.body) {
            return res.json({
                error: 'Missing data',
                status: 400,
            });
        }

        const {
            iid,
            text,
        } = req.body

        try {
            const comment = await dbService.createComment(user, iid, text);
            const commentDto = mapCommentToDto(comment);
            dataBus.broadcastComment(commentDto);
            return res.json({
                payload: '',
                status: 200,
                error: '',
            });
        } catch (err) {
            console.error(err);
            return res.json({
                payload: '',
                status: 500,
                error: 'Server error',
            });
        }
    });

    router.delete('/:cid', getUser, async (req: Express.Request, res: Express.Response) => {
        const {
            metadata: {
                user
            },
        } = req;
        if (!user) {
            return res.json({
                error: 'Unauthorized',
                status: 403,
            });
        }

        const cid = req.params.cid;
        if (!cid) {
            return res.json({
                error: 'Missing comment id',
                status: 400,
            });
        }

        try {
            const iid = await dbService.deleteComment(cid, user);
            if (iid) {
                dataBus.broadcastDeleteComment({ cid, iid });
                return res.json({
                    payload: '',
                    status: 200,
                    error: '',
                });
            } else {
                return res.json({
                    payload: '',
                    status: 404,
                    error: 'Comment not found',
                });
            }
        } catch (err) {
            console.error(err);
            return res.json({
                payload: '',
                status: 500,
                error: 'Server error',
            });
        }
    });

    return router;
}
