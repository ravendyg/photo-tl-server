/// <reference path="./../../typings/interfaces.d.ts" />

var io = require('./../../node_modules/socket.io/node_modules/socket.io-client');

export class SocketService implements ISocketService {
    private _socket: any;
    private _io: any;
    
    private _serverActions: any;
    
    constructor (serverActions) {

        this._io = io;
        
        // has access to server actions emmiter -> when user action on the client delivered to the server
        // there it should be confirmed and after that server broadcasts server action
        // that would be delivered to the stores
        this._serverActions = serverActions;
    }
    
    public connect (url: string) {
        this._socket = this._io(url);
        this._listen();
    }
    
    public disconnect () {
        this._socket.disconnect();
        this._stopListen();
    }
    
    public getConnection () {
        return this._socket;
    }
    
    // tell the server to remove specified photo
    public removePhoto (_id: string) {
        this._socket.emit('remove-photo', {_id});
    }
    
    // tell the server information about uploaded file
    public uploadPhoto (filename: string, title: string, text: string) {
        this._socket.emit('upload-photo', {
            filename, title, text
        });
    }
    
    // vote
    public vote (newVote: number, _id: string) {
console.log(`socket service vote ${newVote} ${_id}`)
        this._socket.emit('vote-photo', {
            _id,
            newVote
        });
    }
        
    // start listen
    private _listen () {
        // photo deleted
        this._socket.on('remove-photo', (data) => {
            this._serverActions.deletePhoto(data._id);
        });
        // new photo uploaded
        this._socket.on('upload-photo', (data) => {
            this._serverActions.uploadPhoto(data);
        });
        // new vote accepted
        this._socket.on('vote-photo', (data) => {
           this._serverActions.votePhoto(data); 
        });
    }
    // stop listen
    private _stopListen () {
        // walk around this issues
        this._socket._callbacks['$remove-photo'] = [];
        this._socket._callbacks['$upload-photo'] = [];
        this._socket._callbacks['$vote-photo'] = [];
    }
}