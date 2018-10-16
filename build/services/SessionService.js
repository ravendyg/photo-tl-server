"use strict";
exports.__esModule = true;
var SessionService = /** @class */ (function () {
    function SessionService(Utils, dbService) {
        this.Utils = Utils;
        this.dbService = dbService;
    }
    SessionService.prototype.addExpirationCookie = function (res, user, rem) {
        var cookieStr = user.name + "|" + (this.Utils.getRandom() * 1e19).toFixed(19);
        ;
        return this.dbService.createSession(cookieStr, user)
            .then(function (success) {
            console.log(success, rem);
            if (success) {
                res.cookie('uId', cookieStr, {
                    maxAge: rem ? 60 * 60 * 24 * 10 : -1
                });
            }
        })["catch"](function (err) {
            console.error(err);
        });
    };
    return SessionService;
}());
exports.SessionService = SessionService;
;
