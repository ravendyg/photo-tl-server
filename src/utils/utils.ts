import {ICryptoService} from '../services/CryptoService';

export interface IUtils {
    getRandom: () => number;
    getUid: () => string;
    getPasswordHash: (uid: string, password: string) => string;
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
}
