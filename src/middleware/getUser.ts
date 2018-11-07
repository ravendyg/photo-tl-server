import * as Express from 'express';
import { IDbService } from '../services/DbService';
import { IUtils } from '../utils/utils';

export function createGetUser(
    dbService: IDbService,
    utils: IUtils,
) {
    const getUser: Express.RequestHandler =
    async (
        req: Express.Request,
        res: Express.Response,
        next: Express.NextFunction,
    ) => {
        try {
            const token = req.header('token');

            if (!token) {
                return res.json({
                    error: "Missing credentials",
                    status: 403,
                });
            }
            const userDto = utils.getUserFromToken(token);
            if (!userDto) {
                return res.json({
                    error: "Missing credentials",
                    status: 403,
                });
            }
            const user = await dbService.getUserByUid(userDto.uid);
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
