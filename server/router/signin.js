const express = require('express');
const router = express.Router();
const User = require('../models/users');

router.get('/', function (req, res) {
    console.log('get into login page');
    res.render('signin');
    res.end();
});

router.post('/login', function (req, res) {
    console.log(req.body);
    User.login(req.body).then((result) => {
        if (result) {
            req.session.username = req.body.username;
            res.redirect('/dashboard');
        } else {
            res.redirect('/login');
        }
    })
});

module.exports = router;