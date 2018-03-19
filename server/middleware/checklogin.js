module.exports = function (req, res, next) {
    console.log(req.session);
    if (req.session.username === undefined || req.session.username === null) {
        res.json({
            code: 203,
            message: 'NOT Login',
            data: null
        })
    } else {
        next();
    }
}