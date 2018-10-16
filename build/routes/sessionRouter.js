"use strict";
exports.__esModule = true;
var express = require("express");
function createSessionRouter(getUser, sessionService) {
    var router = express.Router();
    router.post('/', getUser, function (_req, res) {
        var req = _req;
        var user = req.metadata.user, rem = req.body.rem;
        console.log(req.body);
        sessionService.addExpirationCookie(res, user, rem)
            .then(function () {
            console.log('done');
            res.json(user);
        })["catch"](function (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        });
    });
    router["delete"]('/', function (req, res) {
    });
    return router;
}
exports.createSessionRouter = createSessionRouter;
