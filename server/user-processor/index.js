const express = require('express'),
      status = require('http-status'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser');
const crypto = require('crypto');
// const hash = crypto.createHash('sha256');
const path = require('path');
const fs = require('fs');
      
const utils = require('./../utils');

var api = express.Router();

api.use(bodyParser.json());
api.use(cookieParser());

/**
 * @db - connection to the db
 */
module.exports = function (db) {
    // request to create a new user
    api.post('/new-user', function (req, webRes, next) {
// console.log(req.body);
        
        // check input for correctness
        // assume that it was checked on the client side, therefore any error is likely to be due to
        // a request issued not by the client app - response with error and ignore
        if (req.body.name.match(/[^0-1a-zA-Z\s]/) || req.body.name.match(/^\s*$/) ||
                (req.body.pas !== req.body.pas2) || req.body.pas.match(/^\s*$/)) {
           webRes.status(status.BAD_REQUEST).json({ error: 'data are incorrect' }); 
        } else {
            // check whether a user with this name already exists
            db.collection('users').findOne({name: req.body.name}, function (err, doc) {
                if (err) { utils.serverError(webRes, err); }
                else {
                    if (!doc) {
                        // create new user
                        var dir = crypto.randomBytes(20).toString('hex');
                        // encrypt
// console.log(req.body);
                        var cipher = crypto.createCipher('aes192', req.body.pas);
                        var encrypted = cipher.update(dir, 'utf8', 'hex');
                        encrypted += cipher.final('hex');
                        // save
                        db.collection('users').insert({
                            name: req.body.name, 
                            dir: dir,
                            encrypted: encrypted,
                            // use dir as the first cookie
                            cookies: [ req.body.name+'|'+dir ]
                        }, function (err, doc) {
                            if (err) { utils.serverError(webRes, err); }
                            else {
                                fs.mkdir(path.join(__dirname, '..', '..', 'users_data', dir), function (err) {
                                   if (err) { utils.serverError(webRes, err); }
                                   else {
                                        var dateNow = new Date();
                                        var expiration = (req.body.rem == 'true')
                                                        ? (new Date( (dateNow.setDate(dateNow.getDate() + 10)) ) )
                                                        : 0;
                                        webRes.cookie('uId', req.body.name+'|'+dir, {expires: expiration});
                                        webRes.json({
                                            result: 'user created',
                                            dir: dir
                                        });
                                   }
                                });
                            }
                        });
                    } else {
                        // exists
                        webRes.status(status.FORBIDDEN).json({ error: 'already exists' }); 
                    }
                } 
            });
        }
    });
    
    // signin
    api.get('/sign-in', function (req, webRes, next) {
// console.log(req.query);
        db.collection('users').findOne({
            name: req.query.name
        }, (err, doc) => {
// console.log(doc);
            if (doc) {
                try {
                    var decipher = crypto.createDecipher('aes192', req.query.pas);
                    var decrypted = decipher.update(doc.encrypted, 'hex', 'utf8');
                    decrypted += decipher.final('utf8');
                    // if password is wrong it would throw an exception -> no need to compare result
                    var newCookie = crypto.randomBytes(20).toString('hex');
                    var dateNow = new Date();
                    var expiration = (req.query.rem == 'true')
                                    ? (new Date( (dateNow.setDate(dateNow.getDate() + 10)) ) )
                                    : 0;
// console.log(expiration);
                    webRes.cookie('uId', req.query.name+'|'+newCookie, {expires: expiration});
                    webRes.json({
                        result: 'logedin',
                        name: req.query.name,
                        dir: doc.dir
                    });
                    // update cookies in db
                    db.collection('users').updateOne({name: req.query.name}, {$push: {cookies: req.query.name+'|'+newCookie}},
                            (err, doc) => { if (err) { console.error(err.message);} });
                } catch (e) {
                    console.error(e.message);
                    webRes.status(status.FORBIDDEN).json({ error: 'wrong password' });
                }
            } else {
                webRes.status(status.NOT_FOUND).json({ error: 'wrong username' });
            }           
        });
    });

    // cookie and user name verification
    api.get('/verify-user', function (req, webRes, next) {
        // look for a user with given name and cookie
        db.collection('users').findOne({
            name: req.query.name,
            cookies: {$elemMatch: {$eq: req.cookies.uId}}
        }, function (err, doc) {
            if (err) { utils.serverError(webRes, err); }
            else {
                if (doc && doc.name === req.query.name) {
                    // found the user, checked his name
                    webRes.json({name: doc.name});
                } else {
                    webRes.status(status.FORBIDDEN).json({ error: 'expired' }); 
                }
            }
        });
    });
    
    // remove cookie
    api.delete('/sign-out', function (req, webRes, next) {
        db.collection('users').updateOne({name: req.query.name}, {$pull: {cookies: req.cookies.uId}},
            function (err, doc) {
                if (err) { utils.serverError(webRes, err); }
                else {                  
                    if (doc) {
                        webRes.json({result: 'signed out'});
                    } else {
                        webRes.status(status.NOT_FOUND).json({ error: 'Not found' });
                    } 
                } 
            });
    });
    
    api.use('*', function (req, webRes, next) {
        webRes.status(status.NOT_FOUND).json({ error: 'Not found' });
    });
    
    return api;
}











