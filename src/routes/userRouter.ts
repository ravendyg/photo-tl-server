import * as express from 'express';
import * as Express from 'express';
import { IDbService } from '../services/DbService';
import { IEnrichedRequest } from '../types';

export function createUserRouter(
    getUser: Express.RequestHandler,
    dbService: IDbService,
) {
    const router = express.Router();

    router.get('/', getUser, (_req: Express.Request, res: Express.Response) => {
        const req: IEnrichedRequest = _req as any;
        const {
            metadata: {
                user
            },
        } = req;

        res.json({
            payload: {
                name: user.name,
                uid: user.uid,
            },
            status: 200,
            error: '',
        });
    });

    router.post('/', (req, res) => {
        console.log(req.body);
    });

    router.delete('/', (req, res) => {

    });

    return router;
}
