module.exports = {
    serverError: function (res, err) {
        console.error(err);
        res.status(status.INTERNAL_SERVER_ERROR).json({ error: 'server error' });
    }
}