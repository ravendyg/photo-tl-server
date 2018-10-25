import * as express from 'express';
import * as Express from 'express';
// move to FileService
import * as pump from 'pump';
import * as fs from 'fs';
import * as path from 'path';
import { IDbService } from '../services/DbService';
import { mapPhotoToDto } from '../utils/mappers';
import {IUtils} from '../utils/utils';
import {IConfig} from '../config';

export function createPhotoRouter(
    getUser: Express.RequestHandler,
    dbService: IDbService,
    utils: IUtils,
    config: IConfig,
) {
    const router = express.Router();

    router.get('/', getUser, async (req: Express.Request, res: Express.Response) => {
        const {
            metadata: {
                user
            },
        } = req;
        if (!user) {
            return res.json({
                error: 'Unauthorized',
                status: 403,
            });
        }

        try {
            const photos = await dbService.getPhotos(user);
            const photosDto = photos.map(mapPhotoToDto);

            return res.json({
                payload: photosDto,
                status: 200,
                error: '',
            });
        } catch (err) {
            console.error(err);
            return res.json({
                error: 'Server error',
                status: 500,
            });
        }
    });

    router.post('/', getUser, (req: Express.Request, res: Express.Response) => {
        const type = req.header('Content-Type');
        let ext = '.png';
        if (type) {
            const [, _ext] = type.replace(/;.*/, '').split('/');
            if (_ext) {
                ext = _ext;
            }
        }
        const fileName = [...config.imageDirChunks, `${utils.getUid()}.${ext}`]
            .reduce((acc: string, item: string) => path.join(acc, item), '/');
        console.log(fileName);
        const targetFileStream = fs.createWriteStream(fileName);
        pump(req, targetFileStream, err => {
            if (err) {
                console.error(err);
                res.json({
                    payload: '',
                    status: 500,
                    error: 'Server error',
                });
            } else {
                res.json({
                    payload: '',
                    status: 200,
                    error: '',
                });
            }
        });
    });

    return router;
}
