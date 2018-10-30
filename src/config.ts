import * as path from 'path';
import * as fs from 'fs';

const configJson = JSON.parse(
    fs.readFileSync(
        path.join('src', 'config.json'),
        {encoding: 'utf8'},
    )
);
export interface IDbConfig {
    host: string,
    user: string,
    password: string,
    database: string,
}

export interface IConfig {
    port: number,
    dbConfig: IDbConfig,
    imageDirChunks: string[],
}

export const config: IConfig = {
    port: 4002,
    dbConfig: {
        database: 'db_example',
        host: 'localhost',
        password: 'tully',
        user: 'tully',
    },
    imageDirChunks: configJson.filePathChunks,
};
