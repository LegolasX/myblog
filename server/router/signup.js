const express = require('express');
const router = express.Router();
const ccap = require('ccap');

const Users = require('../models/users');

router.get('/', function (req, res) {
    res.render('signup');
});

router.post('/register', function (req, res) {
    Users.createUser(req.body).then(function (result) {
        res.set('Content-Type', 'application/json; charset=utf-8');
        if (result.insertedCount === 1) {
            res.status(200).send({
                code: 302,
                message: 'redirect',
                data: {
                    url: req.headers.origin + '/signin'
                }
            });
            res.end();
        } else if (result.errorMessage) {
            res.status(200).send({
                code: 1001,
                message: result.errorMessage,
                data: null
            })
            res.end();
        }
    });
});

router.get('/captcha', function (req, res) {
    const map = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    for (var i = 65; i < 91 || i < 123; i++) {
        map.push(String.fromCharCode(i));
        if (i === 90) {
          i = 96;
        }
    }
    function isHas(num, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (num == arr[i]) return true;
        }
        return false;
    }
    var captcha = ccap({
        width: 100,
        height: 34,
        offset: 26,
        fontsize: 28,
        generate: function () {
            var codeArr = [];
            // 用来生成4个随机数
            while (codeArr.length < 4) {
                var index = Math.floor(Math.random() * 62);
                if (!isHas(index, codeArr)) {
                    codeArr.push(map[index]);
                }
            }
            return codeArr.join('');
        }
    });
    let ary = captcha.get();
    console.log(ary);
    res.end(ary[1]);
})

module.exports = router;