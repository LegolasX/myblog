const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.resolve(__dirname, '../dashboard.html'));
});

module.exports = router;