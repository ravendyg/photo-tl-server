import * as express from 'express';
import * as Express from 'express';
import { IDbService } from '../services/DbService';
import { mapPhotoToDto } from '../utils/mappers';
import { IFileService } from '../services/FileService';
import { IPhotoRequest } from '../types';
import { IDataBus } from '../services/DataBus';
import { IUtils } from '../utils/utils';

export function createPhotoRouter(
    getUser: Express.RequestHandler,
    dbService: IDbService,
    utils: IUtils,
    fileService: IFileService,
    dataBus: IDataBus,
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
            res.json({
                error: 'Unauthorized',
                status: 403,
            });
            return;
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
        // maybe need to create PhotoService
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
            .then(photo => {
                const photoDto = mapPhotoToDto(photo);
                dataBus.broadcastNewPhoto(photoDto);
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

    router.patch('/', getUser, async (req: Express.Request, res: Express.Response) => {
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
            // TODO: move to body!
            const iid = req.header('iid') || '';
            const description = req.header('description') || '';
            const title = req.header('title') || '';
            const maybePhoto = await dbService.patchPhoto({
                description,
                iid,
                title,
                user
            });
            if (!maybePhoto) {
                return res.json({
                    payload: '',
                    status: 400,
                    error: 'Could not update',
                });
            } else {
                dataBus.broadcastPatchPhoto(maybePhoto);
                return res.json({
                    payload: '',
                    status: 200,
                    error: '',
                });
            }
        } catch (err) {
            console.error(err);
            return res.json({
                payload: '',
                status: 500,
                error: 'Server error',
            });
        }
    });

    router.delete('/', getUser, async (req: Express.Request, res: Express.Response) => {
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
            const iid = req.header('iid') || '';
            const deleted = await dbService.deletePhoto(iid, user);
            if (deleted) {
                dataBus.broadcastDeletePhoto(iid);
                return res.json({
                    payload: '',
                    status: 200,
                    error: '',
                });
            } else {
                return res.json({
                    payload: '',
                    status: 400,
                    error: 'Could not delete',
                });
            }
        } catch (err) {
            console.error(err);
            return res.json({
                payload: '',
                status: 500,
                error: 'Server error',
            });
        }
    });

    return router;
}
