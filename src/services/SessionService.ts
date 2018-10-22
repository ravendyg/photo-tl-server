import * as Express from 'express';
import {Promise} from 'es6-promise';
import { IUser } from '../types';
import { IUtils } from '../utils/utils';
import { IDbService } from './DbService';

export interface ISessionService {
    addExpirationCookie: (res: Express.Response, user: IUser, rem: boolean) => Promise<void>;
}

export class SessionService implements ISessionService {
    constructor(private utils: IUtils, private dbService: IDbService) {}

    addExpirationCookie(res: Express.Response, user: IUser, rem: boolean) {
        const cookieStr = user.name + "|" + (this.utils.getRandom() * 1e19).toFixed(0);
        return this.dbService.createSession(cookieStr, user)
        .then(success => {
            if (success) {
                res.cookie('uId', cookieStr, {
                    maxAge: rem
                        ? 1000 * 60 * 60 * 24 * 10
                        : 1000 * 60 * 30,
                });
            }
        });
    }
};
