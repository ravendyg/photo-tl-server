import * as Express from 'express';
import { IDbService } from '../services/DbService';
import { IEnrichedRequest } from '../types';
import {ISessionService} from '../services/sessionService';

export function createGetUser(dbService: IDbService, sessionService: ISessionService) {
    const getUser: Express.RequestHandler =
    async (_req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        let req: IEnrichedRequest = _req as any;
        const { body } = req;

        if (!body) {
            return res.status(400).json({ error: "Credentials missing" });
        }
        const { name, pas, } = body;
        if (!name || !pas) {
            return res.status(400).json({ error: "Credentials missing" });
        }

        try {
            const user = await dbService.getUser(name, pas);
            if (user === null) {
                return res.status(404).json({ error: 'Wrong name or password' });
            } else {
                req.metadata = {
                    ...req.metadata,
                    user,
                };
                return next();
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Server error' });
        }
    };

    return getUser;
}
