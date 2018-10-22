import * as express from 'express';
import * as Express from 'express';
import { IDbService } from '../services/DbService';
import { ISessionService } from '../services/SessionService';
import { mapUserToDto } from '../utils/mappers';

export function createSessionRouter(
    dbService: IDbService,
    sessionService: ISessionService,
) {
    const router = express.Router();

    router.post('/', async (
        req: Express.Request,
        res: Express.Response
    ) => {
        try {
            const {
                body: {
                    login,
                    pas,
                    rem,
                } = ({} as any),
            } = req;

            if (!login || !pas) {
                return res.json({
                    error: "Credentials missing",
                    status: 400,
                });
            }

            const user = await dbService.getUser(login, pas);
            if (user === null) {
                return res.json({
                    error: "Wrong login or password",
                    status: 403,
                });
            }

            await sessionService.addExpirationCookie(res, user, rem);
            return res.json({
                status: 200,
                payload: mapUserToDto(user),
            });
        } catch (err) {
            console.error(err);
            return res.json({
                error: "Server error",
                status: 500,
            });
        }
    });

    router.delete('/', (req, res) => {

    });

    return router;
}
