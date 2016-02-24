const express = require('express'),
      status = require('http-status'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser');
const crypto = require('crypto');
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
    api.get('/all-images', function (req, webRes, next) {
// console.log(req.body);
        // req.cookies.uId
        if (req.cookies.uId) {
            db.collection('users').findOne({
                cookies: {$elemMatch: {$eq: req.cookies.uId}}
            }, function (err, doc) {
                if (err) { utils.serverError(webRes, err); }
                else {
                    if (doc) {
                        // found the user
                        db.collection('photos').find({}).toArray(function (err, docs) {
                            if (err) { utils.serverError(webRes, err); }
                            else {
// console.log(docs);
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
 
    // default not found
    api.use('*', function (req, webRes, next) {
        webRes.status(status.NOT_FOUND).json({ error: 'Not found' });
    });
    
    return api;
}










