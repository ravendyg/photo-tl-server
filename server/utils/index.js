const status = require('http-status');

module.exports = {
    serverError: function (err, res) {
        if (err) console.error(err.message);
        if (res) res.status(status.INTERNAL_SERVER_ERROR).json({ error: 'server error' });
    },
    serverSocketAuthError: function (err, next) {
        if (err) console.error(err.message);
        if (next) {
            console.log('Authentication error');
            next(new Error('Authentication error'));
        }
    }
}