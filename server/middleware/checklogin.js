module.exports = function (req, res, next) {
    if (!req.session.username) {
        console.log('Not Login');
        res.json({
            code: 203,
            message: 'NOT Login',
            data: null
        })
    } else {
        next();
    }
}