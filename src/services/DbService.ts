import { IConfig } from '../config';
import * as mysql from 'mysql';
import {Promise} from 'es6-promise';
import { Connection } from 'mysql';
import { IUser } from '../types';
import { ICryptoService } from './CryptoService';

export interface IDbService {
    getUser: (name: string, password: string) => Promise<IUser | null>;

    createSession: (cookieStr: string, user: IUser) => Promise<boolean>;
}

export class DbService implements IDbService {
    private connection: Connection;

    constructor(private config: IConfig, private cryptoService: ICryptoService) {
        this.connection = mysql.createConnection(this.config.dbConfig);
        this.connection.connect();
    }

    getUser(name: string, pas: string): Promise<IUser | null>  {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'SELECT id, uid, name, password FROM users WHERE name = ?;',
                [name],
                (err, res) => {
                    if (err) {
                        console.error(err);
                        return reject('Server error');
                    }
                    if (res.legth === 0) {
                        return resolve(null);
                    }
                    const {
                        id,
                        name,
                        password,
                        uid,
                    } = res[0];
                    const hash = this.cryptoService.getSha256(uid + pas);
                    if (password !== hash) {
                        return resolve(null);
                    }
                    const user: IUser = {
                        id,
                        name,
                        uid,
                    };
                    return resolve(user);
                }
            );
        });
    }

    createSession(cookieStr: string, user: IUser): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'INSERT INTO sessions (cookie, user) VALUES (?, ?);',
                [cookieStr, user.id],
                (err, res) => {
                    if (err) {
                        console.error(err);
                        return reject('Server error');
                    }
                    return resolve(res.insertId > 0 ? true : false);
                }
            );
        });
    }



}
