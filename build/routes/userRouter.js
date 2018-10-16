"use strict";
exports.__esModule = true;
var express = require("express");
function createUserRouter(dbService) {
    var router = express.Router();
    router.post('/', function (req, res) {
        console.log(req.body);
    });
    router["delete"]('/', function (req, res) {
    });
    return router;
}
exports.createUserRouter = createUserRouter;
