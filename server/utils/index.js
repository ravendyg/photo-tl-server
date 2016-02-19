const status = require('http-status');

module.exports = {
    serverError: function (res, err) {
        console.error(err.message);
        res.status(status.INTERNAL_SERVER_ERROR).json({ error: 'server error' });
    }
}