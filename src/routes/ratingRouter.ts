import * as express from 'express';
import * as Express from 'express';
import { IDbService } from '../services/DbService';
import { IDataBus } from '../services/DataBus';

export function createRatingRouter(
    getUser: Express.RequestHandler,
    dbService: IDbService,
    dataBus: IDataBus,
) {
    const router = express.Router();

    router.post('/', getUser, async (req: Express.Request, res: Express.Response) => {
        const {
            body = {},
            metadata: {
                user
            },
        } = req;
        if (!user) {
            res.json({
                error: 'Unauthorized',
                status: 403,
            });
            return;
        }
        const {iid, rating} = body;
        if (!iid || !rating) {
            res.json({
                error: 'Missing data',
                status: 400,
            });
            return;
        }


        try {
            const createdRating = await dbService.createRating(user, iid, rating)
            dataBus.broadcastRating(createdRating);
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

    return router;
}
