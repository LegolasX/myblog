const express = require('express');
const router = express.Router();
const posts = require('../models/posts');
const comments = require('../models/comments');
const categorys = require('../models/category');
const User = require('../models/users');
const CORS = require('../middleware/cors');

const dashboardRouter = require('./dashboard');
const checkLogin = require('../middleware/checklogin');
const {
    res204,
    res500
} = require('../util/statusResponce')

let {
    formateDate
} = require('../util/util.js');

// 后台需要验证登录的接口
router.use('/dashboard', CORS, checkLogin, dashboardRouter);


router.get('/iOSInfo', function (req, res) {
    res.json({
        code: 200,
        data: {
            shouldShow: false,
            url: 'http://140.143.164.218/post/5ad40fd6825ccf3095579b44'
        },
        message: 'success'
    });
})
/* 
    登录注册相关
*/
router.post('/login', CORS, function (req, res, next) {
    console.log(req.body);
    User.login(req.body).then((result) => {
        if (result) {
            req.session.username = req.body.username;
            res.json({
                code: 200,
                message: 'login success',
                data: null
            });
        } else {
            res500(res);
        }
    })
})

/* 
    post
*/

// 根据postId获取post
router.get('/post/:postId', CORS, function (req, res, next) {
    Promise.all([posts.getPostById(req.params.postId), posts.getNextPostById(req.params.postId)]).then(([post, nextPost]) => {
        if (nextPost.length > 0) {
            nextPost = nextPost[nextPost.length - 1];
        } else {
            nextPost = null
        }
        post.postId = post._id;
        delete post._id;
        res.json({
            code: 200,
            data: {
                post,
                nextPost: !nextPost ? null : {
                    postId: nextPost._id,
                    title: nextPost.title,
                    description: nextPost.description
                }
            },
            message: 'OK'
        });
    })
})

// 根据用户名获取postList
router.get('/postList', CORS, function (req, res, next) {
    if (!!req.query.username) {
        let postList = [];
        posts.getPostByUsername(req.query.username).then(data => {
            let promiseList = [];
            postList = data;
            postList.sort(function (a, b) {
                return parseInt(b.createTime) - parseInt(a.createTime);
            })
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
    } else if (!!req.query.categoryId) {
        let postList = [];
        posts.getPostByCategoryId(req.query.categoryId).then(data => {
            let promiseList = [];
            promiseList.push(categorys.getCategoryById(req.query.categoryId));
            postList = data;
            postList.sort(function (a, b) {
                return parseInt(b.createTime) - parseInt(a.createTime);
            })
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
        }).then(([category, ...dataArray]) => {
            category.categoryId = category._id;
            delete category._id;
            postList.forEach((post, index) => {
                post.commentCount = dataArray[index].length;
            });
            res.json({
                code: 200,
                data: {
                    postList,
                    category
                },
                message: 'OK'
            });
        });
    } else {
        console.log('postList no username');
        res.json({
            code: 204,
            data: null,
            message: 'DO NOT HAVE USERNAME'
        });
    }
})

/* 
    comment
*/

// 添加评论
router.post('/comment', CORS, function (req, res, next) {
    if ((!req.body.username && !req.body.postId) || !req.body.comment) {
        res.json({
            code: 204,
            data: null,
            message: 'lack of params'
        });
    }
    // 初始化相关参数
    req.body.dislikeCount = 0;
    req.body.voteCount = 0;
    comments.addComment(req.body).then(result => {
        if (result.insertedCount === 1) {
            res.json({
                code: 200,
                data: {
                    commentId: result.insertedId
                },
                message: 'OK'
            })
        } else {
            res.json({
                code: 204,
                data: null,
                message: 'add fail'
            });
        }
    }, rejected => {
        console.log('rejected');
    })
})

router.get('/comment', CORS, function (req, res) {
    if (!!req.query.postId) {
        comments.getCommentsByPostId(req.query.postId).then(commentList => {
            commentList.forEach((comment) => {
                comment.commentId = comment._id;
                delete comment._id;
                comment.replyList && comment.replyList.sort(function (a, b) {
                    return parseInt(b.commentTime) - parseInt(a.commentTime); 
                });
            });
            commentList.sort(function (a, b) {
                return parseInt(b.commentTime) - parseInt(a.commentTime); 
            });
            res.json({
                code: 200,
                data: commentList,
                message: 'OK'
            })
        });
    } else if (!!req.query.username) {
        // 留言板
        comments.getCommentsByUsername(req.query.username).then(commentList => {
            commentList.forEach((comment) => {
                comment.commentId = comment._id;
                delete comment._id;
                comment.replyList && comment.replyList.sort(function (a, b) {
                    return parseInt(b.commentTime) - parseInt(a.commentTime); 
                });
            });
            commentList.sort(function (a, b) {
                return parseInt(b.commentTime) - parseInt(a.commentTime); 
            });
            res.json({
                code: 200,
                data: commentList,
                message: 'OK'
            })
        });
    }
})

// 根据comemntId给评论点赞
router.get('/comment/:commentId/vote', CORS, function (req, res) {
    if (req.params.commentId !== undefined) {
        comments.voteOrDislikeComment(req.params.commentId, true).then(result => {
            if (result.lastErrorObject.updatedExisting && result.ok === 1) {
                res.json({
                    code: 200,
                    data: null,
                    message: 'vote success'
                });
            } else {
                res.json({
                    code: 500,
                    data: null,
                    message: 'system error'
                });
            }
        })
    } else {
        res.json({
            code: 204,
            data: null,
            message: 'lack of params'
        });
    }
})

// 根据comemntId给评论点反对
router.get('/comment/:commentId/dislike', CORS, function (req, res) {
    if (req.params.commentId !== undefined) {
        comments.voteOrDislikeComment(req.params.commentId, false).then(result => {
            if (result.lastErrorObject.updatedExisting && result.ok === 1) {
                res.json({
                    code: 200,
                    data: null,
                    message: 'dislike success'
                });
            } else {
                res.json({
                    code: 500,
                    data: null,
                    message: 'system error'
                });
            }
        })
    } else {
        res.json({
            code: 204,
            data: null,
            message: 'lack of params'
        });
    }
})

// 根据comemntId给评论点赞
router.get('/comment/:commentId/cancelVote', CORS, function (req, res) {
    if (req.params.commentId !== undefined) {
        comments.cancelVoteOrDislike(req.params.commentId, true).then(result => {
            if (result.lastErrorObject.updatedExisting && result.ok === 1) {
                res.json({
                    code: 200,
                    data: null,
                    message: 'cancel vote success'
                });
            } else {
                res.json({
                    code: 500,
                    data: null,
                    message: 'system error'
                });
            }
        })
    } else {
        res.json({
            code: 204,
            data: null,
            message: 'lack of params'
        });
    }
})

// 根据comemntId给评论点反对
router.get('/comment/:commentId/cancelDislike', CORS, function (req, res) {
    if (req.params.commentId !== undefined) {
        comments.cancelVoteOrDislike(req.params.commentId, false).then(result => {
            if (result.lastErrorObject.updatedExisting && result.ok === 1) {
                res.json({
                    code: 200,
                    data: null,
                    message: 'cancel dislike success'
                });
            } else {
                res.json({
                    code: 500,
                    data: null,
                    message: 'system error'
                });
            }
        })
    } else {
        res.json({
            code: 204,
            data: null,
            message: 'lack of params'
        });
    }
})

// 回复评论

router.post('/comment/reply', CORS, function (req, res) {
    let commentId = req.body.commentId;
    delete req.body.commentId;
    delete req.body.postId;
    if (commentId !== undefined) {
        comments.replyComment(commentId, req.body).then(result => {
            if (result.lastErrorObject.updatedExisting && result.ok === 1) {
                res.json({
                    code: 200,
                    data: null,
                    message: 'reply comment success'
                });
            } else {
                res.json({
                    code: 500,
                    data: null,
                    message: 'system error'
                });
            }
        })
    } else {
        res.json({
            code: 204,
            data: null,
            message: 'lack of params'
        });
    }
});

// 浏览器非简单请求预检查
router.options('*', CORS)


module.exports = router;