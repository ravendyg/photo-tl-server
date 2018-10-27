import { IConfig } from '../config';
import * as mysql from 'mysql';
import { Promise } from 'es6-promise';
import { Connection } from 'mysql';
import { IPhoto, IUser, IPhotoRequest } from '../types';
import { IUtils } from '../utils/utils';

interface IAccumulator<T> {
    [id: number]: T;
}

interface IDbRating {
    id: number;
    value: number;
    count: number;
}

interface IDbCommentCount {
    id: number;
    value: number;
}

interface IDbViewCount {
    id: number;
    value: number;
}

function reduceDbAccumulator<T extends { id: number }>(items: T[]): IAccumulator<T> {
    return (items || []).reduce((acc: IAccumulator<T>, item: T) => {
        acc[item.id] = item;
        return acc;
    }, {})
}

export interface IDbService {
    createUser(name: string, password: string): Promise<IUser | null>;

    getUser(name: string, password: string): Promise<IUser | null>;

    deleteUser(id: number): Promise<void>;

    createSession(cookieStr: string, user: IUser): Promise<boolean>;

    deleteSession(cookieStr: string): Promise<void>;

    getUserBySession(cookieStr: string): Promise<IUser>;

    createPhoto(photoRequest: IPhotoRequest): Promise<void>;

    getPhotos(user: IUser): Promise<IPhoto[]>;
}

export class DbService implements IDbService {
    private connection: Connection;

    constructor (
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
                `INSERT INTO users
                    (uid, name, password)
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
                        return reject(err);
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
                        return reject(err);
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
                        return reject(err);
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
                        return reject(err);
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
                        return reject(err);
                    }
                    return resolve(res[0]);
                }
            );
        });
    }

    createPhoto(photoRequest: IPhotoRequest): Promise<void> {
        return new Promise((resolve, reject) => {
            const {
                description,
                extension,
                iid,
                title,
                uploadedBy,
            } = photoRequest;
            this.connection.query(
                `INSERT INTO images
                    (iid, ext, description, title, uploaded_by)
                VALUES (?, ?, ?, ?, ?);`,
                [iid, extension, description, title, uploadedBy.id],
                (err, _) => {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve();
                    }
                }
            )
        });
    }

    getPhotos(user: IUser): Promise<IPhoto[]> {
        return this.getPhotosWithoutRatingAndComments(user)
            .then(photos => {
                const ids = photos.map(photo => photo.id);
                return Promise.resolve([
                    this.getAverageRatings(ids),
                    this.getCommentCounts(ids),
                    this.getViewCounts(ids),
                ]).then(res => {
                    const [
                        ratings,
                        comments,
                        views,
                    ] = res as any as [
                        IAccumulator<IDbRating>,
                        IAccumulator<IDbCommentCount>,
                        IAccumulator<IDbViewCount>
                    ];
                    return photos.map(photo => {
                        return {
                            ...photo,
                            averageRating: (ratings[photo.id] || { value: 0 }).value,
                            ratingCount: (ratings[photo.id] || { count: 0 }).count,
                            commentCount: (comments[photo.id] || { value: 0 }).value,
                            views: (views[photo.id] || { value: 0 }).value,
                        };
                    });
                });
            });
    }

    private getPhotosWithoutRatingAndComments(user: IUser): Promise<IPhoto[]> {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `SELECT images.id as id, images.iid, images.changed, images.ext,
                    images.description, images.title, images.uploaded,
                    users.id as userId, users.uid, users.name as userName,
                    ratings.value as userRating
                FROM images
                JOIN users
                    ON images.uploaded_by = users.id
                LEFT JOIN ratings
                    ON images.id = ratings.image AND ratings.user = ?
                ;`,
                [user.id],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve(res.map((rawItem: any) => {
                            const {
                                id,
                                iid,
                                description,
                                ext,
                                title,
                                uploaded,
                                changed,
                                userId,
                                uid,
                                userName,
                                userRating,
                            } = rawItem;
                            const photo: IPhoto = {
                                id,
                                iid,
                                description,
                                extension: ext,
                                title,
                                uploadedBy: {
                                    id: userId,
                                    uid,
                                    name: userName,
                                },
                                uploaded,
                                changed,
                                averageRating: 0,
                                commentCount: 0,
                                ratingCount: 0,
                                userRating,
                                views: 0,
                            };

                            return photo;
                        }));
                    }
                }
            );
        });
    }

    private getAverageRatings(ids: number[]): Promise<IAccumulator<IDbRating>> {
        if (ids.length === 0) {
            return Promise.resolve([]);
        }
        return new Promise((resolve) => {
            this.connection.query(
                `SELECT AVG(value) AS rating, COUNT(*) AS count, image as id
                FROM ratings
                WHERE image IN (?)
                GROUP BY image
                ;`,
                [ids],
                (err, res) => {
                    if (err) { console.error(err); }
                    resolve(reduceDbAccumulator<IDbRating>(res));
                });
        });
    }

    private getCommentCounts(ids: number[]): Promise<IAccumulator<IDbCommentCount>> {
        if (ids.length === 0) {
            return Promise.resolve([]);
        }
        return new Promise((resolve) => {
            this.connection.query(
                `SELECT COUNT(*) as value, image as id
                FROM comments
                WHERE image IN (?)
                GROUP BY image
                ;`,
                [ids],
                (err, res) => {
                    if (err) { console.error(err); }
                    resolve(reduceDbAccumulator<IDbCommentCount>(res));
                });
        });
    }

    private getViewCounts(ids: number[]): Promise<IAccumulator<IDbViewCount>> {
        if (ids.length === 0) {
            return Promise.resolve([]);
        }
        return new Promise((resolve) => {
            this.connection.query(
                `SELECT COUNT(*) as value, image as id
                FROM views
                WHERE image IN (?)
                GROUP BY image
                ;`,
                [ids],
                (err, res) => {
                    if (err) { console.error(err); }
                    resolve(reduceDbAccumulator<IDbViewCount>(res));
                });
        });
    }
}
