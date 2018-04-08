const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const category = require('../models/category.js');
const getUploadToken = require('../lib/qiniu').getUploadToken;

let multer  = require('multer')
let upload = multer({
    dest: path.resolve(__dirname, '../upload/')
})



// 获取上传token
router.get('/upload/token', function (req, res) {
    res.json({
        code: 200,
        data: getUploadToken(),
        message: 'get uploadToken success'
    })
})

router.post('/upload', upload.single('cover'), function (req, res) {
    console.log(req.body);
    console.log(req.file);
    if (!!req.file) {
        console.log(req.file.buffer);
        // let writeStream = fs.createWriteStream('../upload/' + req.files.cover.fieldName);
        // writeStream.write(req.files.file.buffer);
        res.json({
            code: 200,
            message: 'sdfs',
            data: null
        });
    }
})

// 创建post
router.post('/post', function (req, res, next) {
    if (!!req.session.username) {
        if (req.body.content) {
            req.body.marked = req.body.content;
            req.body.content = marked(req.body.marked);
            req.body.username = req.session.username;
            req.body.createTime = Date.now().toString();
            req.body.userView = 0;
        }
        posts.createPost(req.body).then((result) => {
            console.log(result.result);
            console.log(result.insertedCount);
            if (result.result.ok === 1) {
                resizeBy.json({
                    code: 200,
                    data: null,
                    message: 'POST SUCCESS'
                });
            }
        });
    } else {
        
    }
});

// 获取分类列表
router.get('/category', function (req, res) {
    if (!!req.session.username) {
        category.getCategoryByUsername(req.session.username).then(result => {
            result.forEach((item) => {
                item.categoryId = item._id;
                delete item._id;
                delete item.username;
            })
            res.json({
                code: 200,
                message: 'get category success',
                data: result
            })
        }, reject => {
            console.log(reject);
            res.json({
                code: 500,
                message: 'mongo error',
                data: null
            })
        })
    } else {
        res.json({
            code: 204,
            messgae: 'lack of params',
            data: null
        });
    }
})

// 添加分类
router.post('/category', function (req, res) {
    if (!!req.session.username && !!req.body.categoryName) {
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
    } else {
        res.json({
            code: 204,
            messgae: 'lack of params',
            data: null
        });
    }

})

// 修改分类
router.put('/category/:categoryId', function (req, res) {
    if (!!req.params.categoryId && !!req.body.categoryName) {
        category.modifyCategoryById(req.params.categoryId, req.body.categoryName).then(result => {
            if (result.lastErrorObject.updatedExisting && !!result.value) {
                res.json({
                    code: 200,
                    message: 'modify category success',
                    data: null
                })
            } else {
                res.json({
                    code: 500,
                    message: 'mongo error',
                    data: null
                })
            }
        })
    } else {
        res.json({
            code: 204,
            messgae: 'lack of params',
            data: null
        });
    }
})

// 删除分类
router.delete('/category/:categoryId', function (req, res) {
    if (!!req.params.categoryId) {
        category.deleteCategoryById(req.params.categoryId).then(result => {
            if (result.result.n === 1) {
                res.json({
                    code: 200,
                    message: 'delete category success',
                    data: null
                })
            } else {
                res.json({
                    code: 500,
                    message: 'mongo error',
                    data: null
                })
            }
        })
    } else {
        res.json({
            code: 204,
            messgae: 'lack of params',
            data: null
        });
    }
})


module.exports = router;