module.exports = {
    res204 (res) {
        res.json({
            code: 204,
            message: 'lack of params',
            data: null
        });
    },
    res500 (res) {
        res.json({
            code: 500,
            data: null,
            message: 'server error'
        });
    },
    res203 (res) {
        res.json({
            code: 203,
            data: null,
            message: 'not login'
        });
    }
}