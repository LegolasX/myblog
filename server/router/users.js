const express = require('express');
const router = express.Router();

router.get('/:userId', function (req, res) {
    res.set({
        'Content-Type': 'text/html'
    });
    res.render('users', {
        name: req.params.userId
    });
});

module.exports = router;