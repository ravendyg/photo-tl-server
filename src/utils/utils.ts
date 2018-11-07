import {ICryptoService} from '../services/CryptoService';
import {IUserDto} from '../types';
import * as jwt from 'jsonwebtoken';

const secret = 'secret';

export interface IUtils {
    getRandom: () => number;

    getUid: () => string;

    getPasswordHash: (uid: string, password: string) => string;

    createToken: (user: IUserDto) => string;

    getUserFromToken: (token: string) => IUserDto | null;
}

export class Utils implements IUtils {
    constructor(private cryptoService: ICryptoService) { }

    getRandom() {
        return Math.random();
    }

    getUid() {
        return this.cryptoService.getSha256('' + this.getRandom());
    }

    getPasswordHash(uid: string, password: string) {
        return this.cryptoService.getSha256(uid + password);
    }

    createToken(user: IUserDto) {
        return jwt.sign(user, secret);
    }

    getUserFromToken(token: string = '') {
        try {
            return jwt.decode(token) as IUserDto;
        } catch (err) {
            return null;
        }
    }
}
