// TODO: don't like it, refactor
import { IConfig } from '../config';
import * as mysql from 'mysql';
import { Promise } from 'es6-promise';
import { Connection } from 'mysql';
import {
    IPhoto,
    IUser,
    IPatchPhotoRequest,
    IPhotoPatch,
    IPhotoRequest,
    IRating,
    IComment,
} from '../types';
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

interface IDbComment {
    cid: string;
    date: string;
    id: number;
    user: number;
    text: string;
    image: number;
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

    getUserByUid(uid: string): Promise<IUser>;

    createPhoto(photoRequest: IPhotoRequest): Promise<IPhoto>;

    patchPhoto(patchPhotoRequest: IPatchPhotoRequest): Promise<IPhotoPatch | null>;

    deletePhoto(iid: string, user: IUser): Promise<boolean>;

    getPhotos(user: IUser): Promise<IPhoto[]>;

    createRating(user: IUser, iid: string, rating: number): Promise<IRating>;

    createComment(user: IUser, iid: string, text: string): Promise<IComment>;

    getComments(iid: string): Promise<IComment[]>;

    deleteComment(cid: string, user: IUser): Promise<string | null>;

    registerView(iid: string, user: IUser): Promise<boolean>;
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

    deleteUser(_id: number) {
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

    getUserByUid(uid: string): Promise<IUser> {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `SELECT id, uid, name
                FROM users
                WHERE uid = ?
                LIMIT 1
                ;`,
                [uid],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(res[0]);
                }
            );
        });
    }

    createPhoto(photoRequest: IPhotoRequest): Promise<IPhoto> {
        return this.insertPhoto(photoRequest)
            .then(() => this.getPhoto(photoRequest.iid));
    }

    patchPhoto(patchPhotoRequest: IPatchPhotoRequest): Promise<IPhotoPatch | null> {
        return new Promise((resolve, reject) => {
            const {
                description,
                iid,
                title,
                user: {
                    id: userId,
                },
            } = patchPhotoRequest;
            this.connection.query(
                `UPDATE images
                    SET title=?, description=?
                WHERE iid=? AND uploaded_by=?
                ;`,
                [title, description, iid, userId],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    } else if (res.affectedRows > 0) {
                        return resolve(
                            this.getPhotoPatch(iid)
                        );
                    } else {
                        return resolve(null);
                    }
                }
            );
        });
    }

    deletePhoto = (iid: string, user: IUser): Promise<boolean> =>
        new Promise((resolve, reject) => {
            console.log(iid, user.id);
            this.connection.query(
                `DELETE FROM images
                WHERE iid=? AND uploaded_by=?
                ;`,
                [iid, user.id],
                (err, res) => {
                    console.log('query done');
                    if (err) {
                        return reject(err);
                    } else if (res.affectedRows > 0) {
                        return resolve(true);
                    } else {
                        return resolve(false);
                    }
                }
            );
        });


    getPhotos(user: IUser): Promise<IPhoto[]> {
        return this.getPhotosWithoutRatingAndComments(user)
            .then(photos => {
                const ids = photos.map(photo => photo.id);
                return Promise.all([
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

    createRating(user: IUser, iid: string, value: number): Promise<IRating> {
        return this.getPhoto(iid)
            .then((photo: IPhoto) => this.upsertRating(user, photo, value))
            .then((imageId: number) => this.getAverageRatings([imageId]))
            .then((ratingAccumulator: IAccumulator<IDbRating>) => {
                const photoId = parseInt(Object.keys(ratingAccumulator)[0], 10);
                const { count, value: averageRating } = ratingAccumulator[photoId];
                return {
                    uid: user.uid,
                    iid,
                    value,
                    count,
                    averageRating,
                };
            });
    }

    createComment = (user: IUser, iid: string, text: string): Promise<IComment> => {
        return this.getPhoto(iid)
            .then((photo: IPhoto) => this.insertComment(user, photo, text))
            .then(this.getComment)
            .then((dbComment: IDbComment) => {
                const {
                    id,
                    cid,
                    date,
                    text,
                } = dbComment;
                const comment: IComment = {
                    cid,
                    date,
                    id,
                    iid,
                    userName: user.name,
                    text,
                    uid: user.uid,
                };
                return comment;
            });
    };

    getComments(iid: string): Promise<IComment[]> {
        return this.getPhoto(iid)
            .then(({ id }: IPhoto) => new Promise((resolve, reject) => {
                const args = [id];
                this.connection.query(
                    `SELECT
                    comments.id AS id
                    , comments.cid AS cid
                    , comments.date AS date
                    , comments.text AS text
                    , users.uid AS uid
                    , users.name AS userName
                FROM comments
                JOIN users ON comments.user=users.id
                WHERE image=?
                ORDER BY date DESC
                ;`,
                    args,
                    (err, res: IComment[]) => {
                        if (err) {
                            return reject(err);
                        } else {
                            res.forEach(comment => {
                                comment.iid = iid;
                            });
                            return resolve(res);
                        }
                    }
                )
            }));
    }

    deleteComment = (cid: string, user: IUser): Promise<string | null> =>
        this.getImageByComment(cid)
            .then((iid: string) => new Promise((resolve, reject) => {
                const args = [cid, user.id];
                this.connection.query(
                    `DELETE FROM comments
                    WHERE cid=? AND user=?
                ;`,
                    args,
                    (err, res) => {
                        if (err) {
                            return reject(err);
                        } else {
                            return resolve(res.affectedRows > 0 ? iid : null);
                        }
                    }
                );
            }));

    registerView(iid: string, user: IUser): Promise<boolean> {
        return this.getPhoto(iid)
            .then(({ id, uploadedBy }: IPhoto) => new Promise((resolve, reject) => {
                if (uploadedBy.id === user.id) {
                    return resolve(false);
                }
                const args = [user.id, id];
                this.connection.query(
                    `INSERT IGNORE INTO views
                    (user, image)
                VALUES (?, ?)
                ;`,
                    args,
                    (err, res) => {
                        if (err) {
                            return reject(err);
                        } else {
                            return resolve(res.affectedRows > 0);
                        }
                    }
                )
            }));
    }

    private insertPhoto: (photoRequest: IPhotoRequest) => Promise<number> =
        (photoRequest: IPhotoRequest) => new Promise((resolve, reject) => {
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
                (err, res) => {
                    if (err) {
                        return reject(err);
                    } else if (res.insertId > 0) {
                        resolve(res.insertId);
                    } else {
                        reject(`Cannot find ${iid}`);
                    }
                }
            );
        });

    private getImageByComment = (cid: string): Promise<string> =>
        new Promise((resolve, reject) => {
            const args = [cid];
            this.connection.query(
                `SELECT
                    images.iid AS iid
                FROM comments
                JOIN images ON images.id=comments.image
                WHERE comments.cid=?
                `,
                args,
                (err, res) => {
                    if (err) {
                        return reject(err);
                    } else if (res.length === 0) {
                        return reject(`${cid} - image not found`);
                    } else {
                        return resolve(res[0].iid);
                    }
                }
            );
        });

    private getComment = (id: number): Promise<IDbComment> => {
        return new Promise((resolve, reject) => {
            const args = [id];
            this.connection.query(
                `SELECT * FROM comments
                WHERE id=?
            LIMIT 1
            ;`,
                args,
                (err, res: IDbComment[]) => {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve(res[0]);
                    }
                }
            )
        });
    };

    private insertComment = (user: IUser, photo: IPhoto, text: string): Promise<number> => {
        const cid = this.utils.getUid();
        const args = [cid, user.id, photo.id, text];
        return new Promise((resolve, reject) => {
            this.connection.query(
                `INSERT INTO comments
                    (cid, user, image, text)
                VALUES (?, ?, ?, ?)
                ;`,
                args,
                (err, res) => {
                    if (err) {
                        return reject(err);
                    } else if (res.insertId) {
                        return resolve(res.insertId);
                    } else {
                        return reject(`Cannot insert ${args}: ${res}`);
                    }
                }
            );
        })
    };

    private upsertRating(user: IUser, photo: IPhoto, value: number): Promise<number> {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `INSERT INTO ratings
                    (user, image, value)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE value=?
                ;`,
                [user.id, photo.id, value, value],
                (err, _) => {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve(photo.id);
                    }
                }
            );
        })
    }

    private getPhoto(iid: string): Promise<IPhoto> {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `SELECT
                    images.id AS id,
                    images.description AS description,
                    images.title AS title,
                    images.uploaded AS uploaded,
                    images.ext AS extension,
                    images.changed AS changed,
                    users.id AS user_id,
                    users.uid as uid,
                    users.name AS user_name
                FROM images
                    JOIN users ON images.uploaded_by=users.id
                WHERE iid=?
                ;`,
                [iid],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    } else if (res.length === 0) {
                        return reject('not found');
                    } else {
                        const {
                            id,
                            description,
                            extension,
                            title,
                            user_id: userId,
                            user_name: userName,
                            uid,
                            uploaded,
                        } = res[0];
                        const photo: IPhoto = {
                            averageRating: 0,
                            changed: 0,
                            commentCount: 0,
                            description,
                            extension,
                            id,
                            iid,
                            ratingCount: 0,
                            title,
                            uploaded,
                            uploadedBy: {
                                id: userId,
                                name: userName,
                                uid,
                            },
                            userRating: 0,
                            views: 0,
                        };
                        return resolve(photo);
                    }
                }
            );
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
                ORDER BY uploaded DESC
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
                                userRating: userRating | 0,
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
                `SELECT AVG(value) AS value, COUNT(*) AS count, image as id
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

    private getPhotoPatch(iid: string): Promise<IPhotoPatch> {
        return new Promise((resolve, reject) => {
            this.connection.query(
                `SELECT description, title, changed from images WHERE iid=?;`,
                [iid],
                (err, res) => {
                    if (err) {
                        return reject(err);
                    } else if (res.length === 0) {
                        return reject('not found');
                    } else {
                        resolve({
                            iid,
                            description: res[0].description,
                            title: res[0].title,
                            changed: res[0].changed,
                        });
                    }
                }
            );
        });
    }
}
