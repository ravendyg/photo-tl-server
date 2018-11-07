import {ICryptoService} from '../services/CryptoService';
import {IUserDto} from '../types';

const secret = 'secret';
const header = JSON.stringify({
    'alg': 'HS256',
    'typ': 'JWT',
});
const headerBase = (new Buffer(header)).toString('base64');

export interface IUtils {
    getRandom: () => number;

    getUid: () => string;

    getPasswordHash: (uid: string, password: string) => string;

    createToken: (user: IUserDto) => string;

    getUserFromToken: (token: string) => IUserDto;
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
        const payload = JSON.stringify(user);
        const payloadBase = (new Buffer(payload)).toString('base64');
        return `${headerBase}.${payloadBase}.signature`;
    }

    getUserFromToken(token: string = '') {
        try {
            const [tokenHeader, payload, signature] = token.split('.');
            if (this.verifySignature(tokenHeader, payload, signature)) {
                return JSON.parse(this.extractPayload(payload));
            }
            return null;
        } catch (err) {
            return null;
        }
    }

    private verifySignature(
        _header: string,
        _payload: string,
        _signature: string
    ) {
        return true;
    }

    private extractPayload(payload: string): any {
        return (new Buffer(payload, 'base64')).toString();
    }
}
