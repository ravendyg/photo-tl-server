"use strict";
exports.__esModule = true;
var crypto = require("crypto");
var CryptoService = /** @class */ (function () {
    function CryptoService() {
    }
    CryptoService.prototype.getSha256 = function (str) {
        var hash = crypto.createHash('sha256');
        hash.update(str);
        return hash.digest('hex');
    };
    return CryptoService;
}());
exports.CryptoService = CryptoService;
