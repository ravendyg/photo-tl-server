const utils = require('./../utils');

// set up web sockets
module.exports = function (server, db) {
    var io = require('socket.io')(server);
    
    // authorization using cookies
    io.use(function(socket, next){
        var uId = socket.request.headers.cookie.match(/uId=[0-1a-zA-Z%].*/)[0];
        // user id exists
        if (uId) {
            uId = uId.slice(4, uId.length).replace('%7C', '|');
console.log(uId);
            // check it
            db.collection('users').findOne({
                cookies: {$elemMatch: {$eq: uId}}
            }, function (err, doc) {
                if (err) { utils.serverSocketAuthError(err, next); }
                else {
                    if (doc) {
                        // user id matches record in the db
                        return next();
                    } else {
                        utils.serverSocketAuthError(null, next);
                    }
                }
            }); 
        } else {
            utils.serverSocketAuthError(null, next);    
        }        
    });
    
    io.on('remove-photo', function (data, cb) {
       console.log(data);
       cb(data); 
    });
};