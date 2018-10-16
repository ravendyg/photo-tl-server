export interface IDbConfig {
    host: string,
    user: string,
    password: string,
    database: string,
}

export interface IConfig {
    port: number,
    dbConfig: IDbConfig,
}

export const config: IConfig = {
    port: 4002,
    dbConfig: {
        database: 'db_example',
        host: 'localhost',
        password: 'tully',
        user: 'tully',
    },
};
