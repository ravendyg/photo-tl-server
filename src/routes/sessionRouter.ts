import * as express from 'express';
import * as Express from 'express';
import { IEnrichedRequest } from '../types';
import {ISessionService} from '../services/SessionService';

export function createSessionRouter(
    getUser: Express.RequestHandler,
    sessionService: ISessionService,
) {
    const router = express.Router();

    router.post('/', getUser, (_req: Express.Request, res: Express.Response) => {
        const req: IEnrichedRequest = _req as any;
        const {
            metadata: {
                user
            },
            body: {
                rem
            }
        } = req;
        console.log(req.body)
        sessionService.addExpirationCookie(res, user, rem)
        .then(() => {
            console.log('done')
            res.json(user);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Server error'} );
        });
    });

    router.delete('/', (req, res) => {

    });

    return router;
}
