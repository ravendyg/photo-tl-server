const express = require('express'),
      status = require('http-status'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;
      
const utils = require('./../utils');

var api = express.Router();

api.use(bodyParser.json());
api.use(cookieParser());

/**
 * @db - connection to the db
 */
module.exports = function (db, dir) {
    // request to create a new user
    api.get('/all-images', function (req, webRes, next) {
        if (req.cookies.uId) {
            db.collection('users').findOne({
                cookies: {$elemMatch: {$eq: req.cookies.uId}}
            }, function (err, doc) {
                if (err) { utils.serverError(err, webRes); }
                else {
                    if (doc) {
                        // found the user
                        db.collection('photos').find({}).toArray(function (err, docs) {
                            if (err) { utils.serverError(err, webRes); }
                            else {
                                webRes.json(docs);
                            }
                        });
                    } else {
                        webRes.status(status.FORBIDDEN).json({ error: 'expired' }); 
                    }
                }
            });   
        } else {
            webRes.status(status.FORBIDDEN).json({ error: 'no session' }); 
        }
    });
    
    // uploading iamge
    api.post('/upload-image', function (req, webRes, next) {
console.log('uploading file');
        if (req.cookies.uId) {
            // where to write
            var filename = crypto.randomBytes(20).toString('hex');
            var pathToFile = path.join(__dirname, '..', '..', 'users_data', 'images', `${filename}.jpg`);
            // check user
            db.collection('users').findOne({
                cookies: {$elemMatch: {$eq: req.cookies.uId}}
            }, function (err, doc) {
                if (err) { utils.serverError(err, webRes); }
                else {
                    if (doc) {
                        // found the user
                        var fileStream = fs.WriteStream(pathToFile);
                        req.pipe(fileStream);

                        // connection aborted - remove output
                        req.on('close', function () {
                            console.log('aborted');
                            // remove partialy loaded file
                            fs.unlink(pathToFile, function (err) {
                                if (err) console.error(err.message);
                                webRes.status(503).send('aborted');
                            });
                        });
                        
                        // uploaded
                        fileStream.on('finish', function () {
                            console.log('file finished');
                            webRes.json({filename: `${filename}.jpg`});
                            
                            // rotate image if necessary
                            exec(`exiftran -ai ${pathToFile}`,
                            (error, stdout, stderr) => {
                                console.log(`stdout: ${stdout}`);
                                console.log(`stderr: ${stderr}`);
                                if (error !== null) {
                                console.log(`exec error: ${error}`);
                                }
                            });
                        });
                    } else {
                        webRes.status(status.FORBIDDEN).json({ error: 'expired' }); 
                    }
                }
            });   
        } else {
            webRes.status(status.FORBIDDEN).json({ error: 'no session' }); 
        } 
    });
 
    // default not found
    api.use('*', function (req, webRes, next) {
        webRes.status(status.NOT_FOUND).json({ error: 'Not found' });
    });
    
    return api;
}











