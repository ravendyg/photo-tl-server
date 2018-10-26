import * as express from 'express';
import * as Express from 'express';
import { IDbService } from '../services/DbService';
import { mapPhotoToDto } from '../utils/mappers';
import {IUtils} from '../utils/utils';
import {IConfig} from '../config';
import {IFileService} from '../services/FileService';
import {IPhotoRequest} from '../types';

export function createPhotoRouter(
    getUser: Express.RequestHandler,
    dbService: IDbService,
    utils: IUtils,
    config: IConfig,
    fileService: IFileService,
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
        const type = req.header('Content-Type');
        let ext = 'png';
        // TODO: implement support for images other that png
        if (type) {
            try {
                const [, _ext] = type.replace(/;.*/, '').split('/');
                if (_ext !== ext) {
                    res.json({
                        payload: '',
                        status: 400,
                        error: 'File type is not supported',
                    });
                    return;
                }
            } catch (err) {
                console.error(err);
            }
        }

        const iid = utils.getUid();
        const fileName = `${iid}.${ext}`;
        fileService.saveImage(req, fileName)
        .then(() => {
            const description = req.header('description') || '';
            const title = req.header('title') || '';
            const photoRequest: IPhotoRequest = {
                description,
                extension: ext,
                iid,
                title,
                uploadedBy: user,
            };
            return dbService.createPhoto(photoRequest);
        })
        .then(() => {
            res.json({
                payload: '',
                status: 200,
                error: '',
            });
        })
        .catch(err => {
            console.error(err);
            res.json({
                payload: '',
                status: 500,
                error: 'Server error',
            });
        });
    });

    return router;
}
