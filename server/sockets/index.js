const ObjectId = require('mongodb').ObjectID;
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
// console.log(data);
// console.log(`remove image ${data._id}`);
            // find record to be deleted to get filename
            db.collection('photos').findOne({_id: ObjectId(data._id)}, function (err, doc) {
                if (err) utils.serverSocketAuthError(err, null);
                else {
                    db.collection('photos').deleteOne({_id: ObjectId(data._id)}, function (err, result) {
                        if (err) utils.serverSocketAuthError(err, null);
                        else if (result.result.n) {
                            // remove file
console.log(`remove: ${doc.src}`);
                            fs.unlink(path.join('users_data', 'images', `${doc.src}`), function (err) {
                                if (err) console.error(err.message);
                            });
                            // send to everyone except the source
                            socket.broadcast.emit('remove-photo', data);
                            // send to the source
                            socket.emit('remove-photo', data);
                        }
                    });
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
                    var newPhoto = {
                        src: data.filename,
                        title: data.title,
                        description: data.text,
                        uploadedBy: user,
                        uploaded: new Date(),
                        changedBy: undefined,
                        changed: undefined,
                        averageRating: {val: 0.0, count: 0},
                        rating: [],
                        views: 0,
                        comments: []
                    };
                    db.collection('photos').insert(newPhoto, function (err, doc) {
                        if (err) utils.serverSocketAuthError(err, null);
                        else {
                            if (doc.result.n) {
                                // uploaded and added to db
                                // send to everyone except the source
                                socket.broadcast.emit('upload-photo', newPhoto);
                                // send to the source
                                socket.emit('upload-photo', newPhoto);
                            }
                        }
                    });
                }
              } 
           });
        });
        
        socket.on('vote-photo', function (data) {
console.log(data);
            // find user
            var user = socket.request.headers.cookie.match(/uId=[0-1a-zA-Z%].*/)[0];
            // user id exists
            if (user) {
                user = user.slice(4, user.length).split('%7C')[0];

                db.collection('photos').findOne(
                        {_id: ObjectId(data._id)},
                        {averageRating: 1, rating: {$elemMatch: {user: user}}}, // {$elemMatch: {$eq: req.cookies.uId}}
                function (err, doc) {
                    if (err) utils.serverSocketAuthError(err, null);
                    else {
// console.log(doc.rating);
                        var sum = doc.averageRating.val * doc.averageRating.count;

                        // recalculate number of votes: +0 if not new, +1 otherwise
// console.log(doc.averageRating.count);
                        doc.averageRating.count += (doc.rating !== undefined ? 0 : 1);
// console.log(doc.averageRating.count);
                        // subtract old vote, if any; add new one
                        sum = sum - (doc.rating !== undefined ? doc.rating[0].val : 0) + (+data.newVote);
                        // write new rating to sum
                        sum = Math.round(sum / doc.averageRating.count *10) / 10;
                        // update
                        function updateRating () {
                            db.collection('photos').update(
                                {_id: doc._id, "rating.user": user},
                                {   $set: {
                                        averageRating: { val: sum, count: doc.averageRating.count },
                                        "rating.$": { user: user, val: +data.newVote }       
                                }
                                    // $pull: {rating: { $elemMatch: {user: user} }},
                                    // $push: {rating: { user: user, val: +data.newVote }}
                                }, function (err, res) {
                                    if (err) utils.serverSocketAuthError(err, null);
                                    else {
//     console.log(res.result.nModified);
                                        // finaly did it - broadcast
                                        var tempRating = {
                                            _id: data._id,
                                            averageRating: { val: sum, count: doc.averageRating.count },
                                            ratingElem: { user: user, val: +data.newVote }
                                        }
                                        // send to everyone except the source
                                        socket.broadcast.emit('vote-photo', tempRating);
                                        // send to the source
                                        socket.emit('vote-photo', tempRating);
                                    }
                                });    
                        }
                        // due to mongodb restrictions if doc.rating !== undefined need firts create an array element
                        if (doc.rating === undefined) {
                            db.collection('photos').update(
                                {_id: doc._id},
                                {$push: {rating: { user: user, val: +data.newVote }}},
                                function (err, res) {
                                    if (err) utils.serverSocketAuthError(err, null);
                                    else {
// console.log(res);
                                        updateRating();
                                    }
                                })
                        } else {
                            // exists, just update
                            updateRating();
                        }
                        
                    }
                });
            }
        });
    });
    
    
};