import * as Express from 'express';
import { IDbService } from '../services/DbService';

export function createGetUser(dbService: IDbService) {
    const getUser: Express.RequestHandler =
    async (
        req: Express.Request,
        res: Express.Response,
        next: Express.NextFunction,
    ) => {
        try {
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
