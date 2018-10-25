import * as express from 'express';
import * as Express from 'express';
import { IDbService } from '../services/DbService';
import { mapPhotoToDto } from '../utils/mappers';

export function createPhotoRouter(
    getUser: Express.RequestHandler,
    dbService: IDbService,
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

    router.post('/', getUser, (_req: Express.Request, res: Express.Response) => {
        // const req: IEnrichedRequest = _req as any;
        // const {
        //     metadata: {
        //         user
        //     },
        // } = req;

        res.json({
            payload: '',
            status: 200,
            error: '',
        });
    });

    return router;
}
