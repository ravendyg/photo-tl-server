// import * as fs from 'fs';
// import * as path from 'path';
// import * as pump from 'pump';
import { Promise } from 'es6-promise';
import * as stream from 'stream';
import {IConfig} from '../config';

export interface IFileService {
    saveImage: (req: stream.Readable, fileName: string) => Promise<any>;
}

export class FileService implements IFileService {
    constructor(
        private config: IConfig,
        // don't know how to handle module type
        private fs: any,
        private path: any,
        private pump: any,
    ) {}

    saveImage(req: stream.Readable, fileName: string) {
        const imagePath = this.getImagePath(fileName);
        return new Promise((resolve, reject) => {
            const targetFileStream: stream.Writable = this.fs.createWriteStream(imagePath);
            this.pump(req, targetFileStream, (err: Error) => {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    }

    private getImagePath(fileName: string) {
        return [...this.config.imageDirChunks, fileName]
            .reduce((acc: string, item: string) => this.path.join(acc, item), '/');
    }
}
