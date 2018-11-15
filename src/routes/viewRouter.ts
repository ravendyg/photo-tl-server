import * as express from 'express';
import * as Express from 'express';
import { IDbService } from '../services/DbService';
import { IDataBus } from '../services/DataBus';

export function createViewRouter(
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
            return res.json({
                error: 'Unauthorized',
                status: 403,
            });
        }

        const {iid} = body;
        if (!iid) {
            return res.json({
                error: 'Missing image id',
                status: 400,
            });
        }

        try {
            const inserted = await dbService.registerView(iid, user);
            if (inserted) {
                dataBus.broadcastAddView(iid);
            }
            return res.json({
                error: '',
                status: 200,
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
