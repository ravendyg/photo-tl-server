export function config (param: string): string {
    switch (param) {
        case 'url':
            return 'http://localhost';
        case 'port':
            return ':8080';
        case 'userDriver':
            return '/user-processor';
        case 'imageDriver':
            return '/image-processor';
    }
}