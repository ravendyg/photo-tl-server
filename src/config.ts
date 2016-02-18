export function config (param: string): any {
    switch (param) {
        case 'url':
            return 'localhost';
        case 'port':
            return 8080;
    }
}