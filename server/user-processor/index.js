var express = require('express'),
      status = require('http-status'),
      bodyParser = require('body-parser');
      
var utils = require('./../utils');

var api = express.Router();

api.use(bodyParser.json());

/**
 * @db - connection to the db
 */
module.exports = function (db) {
    // request to create a new user
    api.post('/new-user', function (req, webRes, next) {
        console.log(req.body);
        
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
                    } else {
                        // exists
                        webRes.status(status.FORBIDDEN).json({ error: 'already exists' }); 
                    }
                } 
            });
        }

        webRes.status(status.INTERNAL_SERVER_ERROR).json({ error: 'server error' }); 
    });

    // plug
    api.get('/new-user', function (req, webRes, next) {
        console.log(req.body);
        
        webRes.status(status.INTERNAL_SERVER_ERROR).json({ error: 'server error' }); 
    });
    
    api.use('*', function (req, webRes, next) {
        webRes.status(status.NOT_FOUND).json({ error: 'Not found' });
    });
    
    return api;
}











