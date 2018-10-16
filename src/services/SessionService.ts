import * as Express from 'express';
import {Promise} from 'es6-promise';
import { IUser } from '../types';
import { IUtils } from '../utils/utils';
import { IDbService } from './DbService';

export interface ISessionService {
    addExpirationCookie: (res: Express.Response, user: IUser, rem: boolean) => Promise<void>;
}

export class SessionService implements ISessionService {
    constructor(private Utils: IUtils, private dbService: IDbService) {}

    addExpirationCookie(res: Express.Response, user: IUser, rem: boolean) {
        const cookieStr = user.name + "|" + (this.Utils.getRandom() * 1e19).toFixed(19);;
        return this.dbService.createSession(cookieStr, user)
        .then(success => {
            console.log(success, rem)
            if (success) {
                res.cookie('uId', cookieStr, {
                    maxAge: rem ? 60 * 60 * 24 * 10 : -1,
                });
            }
        })
        .catch(err => {
            console.error(err);
        });
    }
};
