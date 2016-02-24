var io = require('./../../node_modules/socket.io/node_modules/socket.io-client');

export class SocketService {
    private _socket: any;
    
    constructor() {
        console.log('socket');
    }
    
    public connect (url: string) {
        this._socket = io.connect(url);
    }
    
    public getConection () {
        return this._socket;
    }
    
    public removePhoto (id: number) {
        this._socket.emit('remove-photo', {id}, (resp) => {
           console.log(resp); 
        });
    }
}