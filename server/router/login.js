const express = require('express');
const router = express.Router();
const User = require('../models/users');

router.post('/', function (req, res) {
    console.log(req.body);
    User.login(req.body).then((result) => {
        if (result) {
            req.session.username = req.body.username;
            res.redirect('/dashboard');
        } else {
            res.redirect('/dashboard');
        }
    })
});

module.exports = router;