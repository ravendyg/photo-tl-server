import * as express from 'express';
import {IDbService} from '../services/DbService';

export function createUserRouter(dbService: IDbService) {
    const router = express.Router();

    router.post('/', (req, res) => {
        console.log(req.body);
    });

    router.delete('/', (req, res) => {

    });

    return router;
}
