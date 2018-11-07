import * as express from 'express';
import * as Express from 'express';
import { IDbService } from '../services/DbService';
import { IUserDto } from '../types';
import { IUtils } from '../utils/utils';
import {mapUserToDto} from '../utils/mappers';

export function createUserRouter(
    dbService: IDbService,
    utils: IUtils,
) {
    const router = express.Router();

    router.get('/', async (req: Express.Request, res: Express.Response) => {
        try {
            const login = req.header('login');
            const pas = req.header('pas');

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

            const token = utils.createToken(user);
            return res.json({
                status: 200,
                payload: token,
            });
        } catch (err) {
            console.error(err);
            return res.json({
                error: "Server error",
                status: 500,
            });
        }
    });

    router.post('/', async (req: Express.Request, res: Express.Response) => {
        try {
            const {
                body: {
                    login,
                    pas,
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

            const userDto: IUserDto = mapUserToDto(user);
            const token = utils.createToken(userDto);
            return res.json({
                payload: token,
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

    return router;
}
