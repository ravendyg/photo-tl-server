import { IConfig } from '../config';
import * as mysql from 'mysql';
import { Promise } from 'es6-promise';
import { Connection } from 'mysql';
import { IPhoto, IUser } from '../types';
import { IUtils } from '../utils/utils';

export interface IDbService {
    createUser(name: string, password: string): Promise<IUser | null>;

    getUser(name: string, password: string): Promise<IUser | null>;

    deleteUser(id: number): Promise<void>;

    createSession(cookieStr: string, user: IUser): Promise<boolean>;

    deleteSession(cookieStr: string): Promise<void>;

    getUserBySession(cookieStr: string): Promise<IUser>;

    getPhotos(): Promise<IPhoto[]>;
}

export class DbService implements IDbService {
    private connection: Connection;

    constructor(
        private config: IConfig,
        private utils: IUtils,
    ) {
        this.connection = mysql.createConnection(this.config.dbConfig);
        this.connection.connect();
    }

    createUser(name: string, password: string): Promise<IUser | null> {
        return new Promise((resolve, reject) => {
            const uid = this.utils.getUid();
            const hash = this.utils.getPasswordHash(uid, password);
            this.connection.query(
                `INSERT INTO users (uid, name, password)
                VALUES (?, ?, ?)
                ;`,
                [uid, name, hash],
                (err, res) => {
                    if (err && err.errno === 1062) {
                        return resolve(null);
                    } else if (res && res.affectedRows > 0) {
                        return resolve({
                            id: res.insertId,
                            name,
                            uid,
                        });
                    } else {
                        return reject('Server error');
                    }
                }
            );
        });
    }

    getUser(name: string, pas: string): Promise<IUser | null> {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `SELECT id, uid, name, password
                FROM users
                WHERE name = ?
                LIMIT 1
                ;`,
                [name],
                (err, res: any[]) => {
                    if (err) {
                        console.error(err);
                        return reject('Server error');
                    }
                    if (res.length === 0) {
                        return resolve(null);
                    }
                    const {
                        id,
                        name,
                        password,
                        uid,
                    } = res[0];
                    const hash = this.utils.getPasswordHash(uid, pas);
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

    deleteUser(id: number) {
        return Promise.resolve();
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

    deleteSession(cookieStr: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.connection.query(
                'DELETE FROM sessions WHERE cookie=?;',
                [cookieStr],
                (err) => {
                    if (err) {
                        console.error(err);
                        return reject('Server error');
                    }
                    return resolve();
                }
            )
        });
    }

    getUserBySession(cookieStr: string): Promise<IUser> {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `SELECT users.id, users.uid, users.name
                FROM sessions
                    JOIN users ON sessions.user = users.id
                WHERE sessions.cookie = ?
                LIMIT 1
                ;`,
                [cookieStr],
                (err, res) => {
                    if (err) {
                        console.error(err);
                        return reject('Server error');
                    }
                    return resolve(res[0]);
                }
            );
        });
    }

    getPhotos(): Promise<IPhoto[]> {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `SELECT images.id as photoId, images.iid, images.changed,
                    images.description, images.title, images.uploaded,
                    users.id as userId, users.uid, users.name as userName
                FROM images
                    JOIN users
                    ON images.uploaded_by = users.id
                ;`,
                [],
                (err, res) => {
                    if (err) {
                        console.error(err);
                        return reject('Server error');
                    } else {
                        return resolve(res.map((rawItem: any) => {
                            const {
                                photoId,
                                iid,
                                description,
                                title,
                                uploaded,
                                changed,
                                userId,
                                uid,
                                userName,
                            } = rawItem;

                            return {
                                id: photoId,
                                iid,
                                description,
                                title,
                                uploadedBy: {
                                    id: userId,
                                    uid,
                                    name: userName,
                                },
                                uploaded,
                                changed,
                            }
                        }));
                    }
                }
            );
        });
    }

}
