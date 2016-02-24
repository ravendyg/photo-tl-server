const fs = require('fs');
const path = require('path');
const utils = require('./../utils');

// set up web sockets
module.exports = function (server, db) {
    var io = require('socket.io')(server);
    
    // authorization using cookies - executed for every connection
    io.use(function(socket, next){
        var uId = socket.request.headers.cookie.match(/uId=[0-1a-zA-Z%].*/)[0];
        // user id exists
        if (uId) {
            uId = uId.slice(4, uId.length).replace('%7C', '|');
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
    
    // one connection for every browser-tab
    io.on('connection', function (socket) {
console.log('user connected');
        
        socket.on('disconnect', function () {
console.log('user disconnected');
        });
        
        socket.on('remove-photo', function (data) {
console.log(`remove image ${data.id}`);
            db.collection('photos').deleteOne({id: data.id}, function (err, result) {
                if (err) utils.serverSocketAuthError(err, null);
                else if (result.result.n) {
                    // send to everyone except the source
                    socket.broadcast.emit('remove-photo', data);
                    // send to the source
                    socket.emit('remove-photo', data);
                }
            });  
        });
        
        socket.on('upload-photo', function (data) {
           // check that file exists
           fs.exists(path.join('users_data', 'images', `${data.filename}`), function (exists) {
              if (exists) {
                // find user
                var user = socket.request.headers.cookie.match(/uId=[0-1a-zA-Z%].*/)[0];
                // user id exists
                if (user) {
                    user = user.slice(4, user.length).split('%7C')[0];
                    db.collection('photos').insert({
                        src: data.filename,
                        title: data.title,
                        description: data.text,
                        uploadedBy: user,
                        uploadedNum: Date.now(),
                        changedBy: undefined,
                        changedNum: undefined,
                        rating: 0,
                        myRating: 0,
                        views: 0,
                        comments: []
                    }, function (err, doc) {
                        if (err) utils.serverSocketAuthError(err, null);
                        else {
                            console.log(doc);
                            // here! //
                        }
                    });
                }
              } 
           });
           
           // create db record
           // broadcast 
        });
    });
    
    
};