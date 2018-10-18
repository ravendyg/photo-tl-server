import * as Express from 'express';
import { IDbService } from '../services/DbService';
import { IEnrichedRequest } from '../types';
import { ISessionService } from '../services/sessionService';

export function createGetUser(dbService: IDbService, sessionService: ISessionService) {
    const getUser: Express.RequestHandler =
    async (_req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
        try {
            let req: IEnrichedRequest = _req as any;
            const { uId } = req.cookies;

            if (!Boolean(uId)) {
                return res.json({
                    error: "Session does not exist",
                    status: 403,
                });
            }

            const user = await dbService.getUserBySession(uId);
            if (user === null) {
                return res.json({
                    error: "Session expired",
                    status: 403,
                });
            } else {
                req.metadata = {
                    ...req.metadata,
                    user,
                };
                return next();
            }
        } catch (err) {
            console.error(err);
            return res.json({
                error: "Server error",
                status: 500,
            });
        }
    };

    return getUser;
}
