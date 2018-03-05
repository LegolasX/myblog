module.exports = function (req, res, next) {
    console.log(req.session);
    if (req.session.username === undefined || req.session.username === null) {
        res.redirect('/login');
    } else {
        next();
    }
}