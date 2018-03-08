const express = require('express');
const router = express.Router();
const posts = require('../models/posts');
const comments = require('../models/comments');
const CORS = require('../middleware/cors');
const marked = require('marked');

/* 
    post
*/

// 创建post
router.post('/post', function (req, res, next) {
    if (req.session.username === undefined) {
        res.json({
            code: 203,
            data: {
                loginUrl: 'hh'
            },
            message: 'Not Login'
        });
    } else {
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
    }
});

// 根据postId获取post
router.get('/post/:postId', CORS, function (req, res, next) {
    posts.getPostById(req.params.postId).then(post => {
        post.postId = post._id;
        delete post._id;
        res.json({
            code: 200,
            data: post,
            message: 'OK'
        });
    });
})

// 根据用户名获取postList
router.get('/postList/:username', CORS, function (req, res, next) {
    if (req.params.username !== undefined) {
        let postList = [];
        posts.getPostByUsername(req.params.username).then(data => {
            let promiseList = [];
            postList = data;
            postList.forEach((post, index) => {
                post.postId = post._id;
                delete post._id;
                promiseList.push(comments.getCommentsByPostId(post.postId));
                if (post.createTime) {
                    let time = new Date(parseInt(post.createTime));
                    post.createTime = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}`;
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
    if (req.body.postId === undefined || req.body.comment === undefined) {
        res.json({
            code: 203,
            data: null,
            message: 'lack of params'
        });
    }
    req.body.postId = parseInt(req.body.postId);
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
    if (req.query.postId === undefined) {
        res.json({
            code: 203,
            data: null,
            message: 'lack of params'
        });
    } else {
        comments.getCommentsByPostId(parseInt(req.query.postId)).then(commentList => {
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
        comments.voteOrDislikeComment(parseInt(req.params.commentId), true).then(result => {
            if (result.lastErrorObject.updatedExisting && result.ok === 1) {
                res.json({
                    code: 200,
                    data: null,
                    message: 'vote success'
                });
            } else {
                res.json({
                    code: 204,
                    data: null,
                    message: 'system error'
                });
            }
        })
    } else {
        res.json({
            code: 203,
            data: null,
            message: 'lack of params'
        });
    }
})

// 根据comemntId给评论点反对
router.get('/comment/:commentId/dislike', CORS, function (req, res) {
    if (req.params.commentId !== undefined) {
        comments.voteOrDislikeComment(parseInt(req.params.commentId), false).then(result => {
            if (result.lastErrorObject.updatedExisting && result.ok === 1) {
                res.json({
                    code: 200,
                    data: null,
                    message: 'dislike success'
                });
            } else {
                res.json({
                    code: 204,
                    data: null,
                    message: 'system error'
                });
            }
        })
    } else {
        res.json({
            code: 203,
            data: null,
            message: 'lack of params'
        });
    }
})

// 根据comemntId给评论点赞
router.get('/comment/:commentId/cancelVote', CORS, function (req, res) {
    if (req.params.commentId !== undefined) {
        comments.cancelVoteOrDislike(parseInt(req.params.commentId), true).then(result => {
            if (result.lastErrorObject.updatedExisting && result.ok === 1) {
                res.json({
                    code: 200,
                    data: null,
                    message: 'cancel vote success'
                });
            } else {
                res.json({
                    code: 204,
                    data: null,
                    message: 'system error'
                });
            }
        })
    } else {
        res.json({
            code: 203,
            data: null,
            message: 'lack of params'
        });
    }
})

// 根据comemntId给评论点反对
router.get('/comment/:commentId/cancelDislike', CORS, function (req, res) {
    if (req.params.commentId !== undefined) {
        comments.cancelVoteOrDislike(parseInt(req.params.commentId), false).then(result => {
            if (result.lastErrorObject.updatedExisting && result.ok === 1) {
                res.json({
                    code: 200,
                    data: null,
                    message: 'cancel dislike success'
                });
            } else {
                res.json({
                    code: 204,
                    data: null,
                    message: 'system error'
                });
            }
        })
    } else {
        res.json({
            code: 203,
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
        comments.replyComment(parseInt(commentId), req.body).then(result => {
            if (result.lastErrorObject.updatedExisting && result.ok === 1) {
                res.json({
                    code: 200,
                    data: null,
                    message: 'reply comment success'
                });
            } else {
                res.json({
                    code: 204,
                    data: null,
                    message: 'system error'
                });
            }
        })
    } else {
        res.json({
            code: 203,
            data: null,
            message: 'lack of params'
        });
    }
});

// 浏览器非简单请求预检查
router.options('*', CORS)


module.exports = router;