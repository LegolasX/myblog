const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const posts = require('../models/posts.js');
const category = require('../models/category.js');
const comments = require('../models/comments.js');
const marked = require('marked');
const getUploadToken = require('../lib/qiniu').getUploadToken;
let {
    formateDate
} = require('../util/util.js');

let multer  = require('multer')
let upload = multer({
    dest: path.resolve(__dirname, '../upload/')
})

function resLackParams (res) {
    res.json({
        code: 204,
        message: 'lack of params',
        data: null
    });
}

function res500 (res) {
    res.json({
        code: 500,
        data: null,
        message: 'server error'
    });
}

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
    if (!!req.body.markdown && !!req.body.categoryId) {
        req.body.content = marked(req.body.markdown);
        req.body.username = req.session.username;
        req.body.pageview = 0;
        posts.createPost(req.body).then((result) => {
            if (result.insertedCount === 1) {
                res.json({
                    code: 200,
                    data: null,
                    message: 'POST SUCCESS'
                });
            } else {
                res.json({
                    code: 500,
                    data: null,
                    message: 'server error'
                });
            }
        });
    } else {
        resLackParams(res);
    }
});

// 根据用户名获取postList
router.get('/postList', function (req, res, next) {
    let username = req.session.username;
    let postList = [];
    posts.getPostByUsername(username).then(data => {
        let promiseList = [];
        postList = data;
        postList.forEach((post, index) => {
            post.postId = post._id;
            delete post._id;
            promiseList.push(comments.getCommentsByPostId(post.postId));
            if (post.createTime) {
                let time = formateDate(post.createTime);
                post.createTime = time.date;
            }
        });
        return Promise.all(promiseList);
    }).then(dataArray => {
        postList.forEach((post, index) => {
            post.commentCount = dataArray[index].length;
        });
        res.json({
            code: 200,
            data: postList,
            message: 'OK'
        });
    });
})

// 更新post
router.put('/post/:postId', function (req, res) {
    if (!!req.body.markdown && !!req.body.categoryId && !!req.params.postId) {
        req.body.content = marked(req.body.markdown);
        req.body.username = req.session.username;
        posts.updatePost(req.params.postId, req.body).then(result => {
            if (result.lastErrorObject.updatedExisting && !!result.value) {
                res.json({
                    code: 200,
                    message: 'update post success',
                    data: null
                });
            } else {
                res500(res);
            }
        });
    } else {
        resLackParams(res);
    }
})

// 删除post
router.delete('/post/:postId', function (req, res) {
    if (!!req.params.postId) {
        posts.deletePost(req.params.postId).then(result => {
            comments.deleteCommentByPostId(req.params.postId).then(result => {
                console.log(`删除postId:${req.params.postId}下${result.result.n}条评论`);
            })
            if (result.result.n === 1) {
                res.json({
                    code: 200,
                    message: 'delete post success',
                    data: null
                });
            } else {
                res500(res);
            }
        })
    } else {
        resLackParams(res);
    }
})

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
        posts.getPostByCategoryId(req.params.categoryId).then(result => {
            if (result.length > 0) {
                res.json({
                    code: 205,
                    message: 'posts not empty',
                    data: result.length
                });
            } else {
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
            }
        })
        /* */
    } else {
        res.json({
            code: 204,
            messgae: 'lack of params',
            data: null
        });
    }
})


module.exports = router;