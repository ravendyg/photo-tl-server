"use strict";
exports.__esModule = true;
var express = require("express");
function createUserRouter(dbService) {
    var router = express.Router();
    router.post('/new-user', function (req, res) {
    });
}
exports.createUserRouter = createUserRouter;
