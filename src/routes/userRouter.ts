import * as express from 'express';
import * as Express from 'express';
import { IDbService } from '../services/DbService';
import { IUserDto } from '../types';
import { ISessionService } from '../services/SessionService';

export function createUserRouter(
    getUser: Express.RequestHandler,
    dbService: IDbService,
    sessionService: ISessionService,
) {
    const router = express.Router();

    router.get('/', getUser, (req: Express.Request, res: Express.Response) => {
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

        const userDto: IUserDto = user;
        return res.json({
            payload: userDto,
            status: 200,
            error: '',
        });
    });

    router.post('/', async (req: Express.Request, res: Express.Response) => {
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
                    error: 'Credentials missing',
                    status: 400,
                });
            }

            const user = await dbService.createUser(login, pas);
            if (user === null) {
                return res.json({
                    error: 'User already exists',
                    status: 409,
                });
            }
            try {
                await sessionService.addExpirationCookie(res, user, rem);
            } catch (sessionErr) {
                console.error(sessionErr);
                dbService.deleteUser(user.id).catch(() => {});
                return res.json({
                    error: 'Server error',
                    status: 500,
                });
            }
            const userDto: IUserDto = user;
            return res.json({
                payload: userDto,
                status: 200,
                error: '',
            });
        } catch (err) {
            console.error(err);
            return res.json({
                error: 'Server error',
                status: 500,
            });
        }
    });

    router.delete('/', (req, res) => {

    });

    return router;
}
