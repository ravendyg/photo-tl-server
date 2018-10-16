"use strict";
exports.__esModule = true;
var mysql = require("mysql");
var es6_promise_1 = require("es6-promise");
var DbService = /** @class */ (function () {
    function DbService(config, cryptoService) {
        this.config = config;
        this.cryptoService = cryptoService;
        this.connection = mysql.createConnection(this.config.dbConfig);
        this.connection.connect();
    }
    DbService.prototype.getUser = function (name, pas) {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this.connection.query('SELECT id, uid, name, password FROM users WHERE name = ?;', [name], function (err, res) {
                if (err) {
                    console.error(err);
                    return reject('Server error');
                }
                if (res.legth === 0) {
                    return resolve(null);
                }
                var _a = res[0], id = _a.id, name = _a.name, password = _a.password, uid = _a.uid;
                var hash = _this.cryptoService.getSha256(uid + pas);
                if (password !== hash) {
                    return resolve(null);
                }
                var user = {
                    id: id,
                    name: name,
                    uid: uid
                };
                return resolve(user);
            });
        });
    };
    DbService.prototype.createSession = function (cookieStr, user) {
        var _this = this;
        return new es6_promise_1.Promise(function (resolve, reject) {
            _this.connection.query('INSERT INTO sessions (cookie, user) VALUES (?, ?);', [cookieStr, user.id], function (err, res) {
                if (err) {
                    console.error(err);
                    return reject('Server error');
                }
                return resolve(res.insertId > 0 ? true : false);
            });
        });
    };
    return DbService;
}());
exports.DbService = DbService;
