import * as crypto from 'crypto';

export interface ICryptoService {
    getSha256: (str: string) => string;
}

export class CryptoService implements ICryptoService {
    getSha256(str: string) {
        let hash = crypto.createHash('sha256');
        hash.update(str);
        return hash.digest('hex');
    }
}
