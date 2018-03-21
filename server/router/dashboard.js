const express = require('express');
const router = express.Router();
const path = require('path');
const category = require('../models/category.js');

// 获取分类列表
router.get('/category', function (req, res) {
    if (req.session.username !== undefined) {
        category.getCategoryByUsername(req.session.username).then(result => {
            console.log(result);
        })
    }
})

// 添加分类
router.post('/category', function (req, res) {
    if (req.session.username !== undefined  && req.body.categoryName !== undefined) {
        category.addCategory({
            username: req.session.username,
            categoryName: req.body.categoryName
        }).then(result => {
            if (result.insertedCount === 1) {
                res.json({
                    code: 200,
                    message: 'add category success',
                    data: {
                        categoryId: result.insertedId
                    }
                });
            } else {
                res.json({
                    code: 204,
                    messgae: 'fail',
                    data: null
                });
            }
        })
    }

})


module.exports = router;