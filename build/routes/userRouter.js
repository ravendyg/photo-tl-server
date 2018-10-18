"use strict";
exports.__esModule = true;
var express = require("express");
function createUserRouter(getUser, dbService) {
    var router = express.Router();
    router.get('/', getUser, function (_req, res) {
        var req = _req;
        var user = req.metadata.user;
        res.json({
            payload: {
                name: user.name,
                uid: user.uid
            },
            status: 200,
            error: ''
        });
    });
    router.post('/', function (req, res) {
        console.log(req.body);
    });
    router["delete"]('/', function (req, res) {
    });
    return router;
}
exports.createUserRouter = createUserRouter;
