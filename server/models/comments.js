let MongoManager = require('../lib/mongo.js');
let ObjectID = require('mongodb').ObjectID;
const COLLECTION = 'comments';

module.exports = {
    addComment (comments) {
        // postId 类型转换
        comments.postId = ObjectID(comments.postId);
        return MongoManager.insertOne(COLLECTION, comments);
    },
    getCommentsByPostId (postId) {
        return MongoManager.find(COLLECTION, {
            postId: ObjectID(postId)
        });
    },
    voteOrDislikeComment (commentId, vote) {
        if (vote) {
            return MongoManager.findOneAndUpdate(COLLECTION, {
                '_id': ObjectID(commentId)
            }, {
                $inc: {
                    voteCount: 1
                }
            });
        } else {
            return MongoManager.findOneAndUpdate(COLLECTION, {
                '_id': ObjectID(commentId)
            }, {
                $inc: {
                    dislikeCount: 1
                }
            });
        }
    },
    cancelVoteOrDislike (commentId, vote) {
        if (vote) {
            return MongoManager.findOneAndUpdate(COLLECTION, {
                '_id': ObjectID(commentId)
            }, {
                $inc: {
                    voteCount: -1
                }
            });
        } else {
            return MongoManager.findOneAndUpdate(COLLECTION, {
                '_id': ObjectID(commentId)
            }, {
                $inc: {
                    dislikeCount: -1
                }
            });
        }
    },
    replyComment (commentId, comment) {
        return MongoManager.findOneAndUpdate(COLLECTION, {
            '_id': ObjectID(commentId)
        }, {
            $push: {
                replyList: comment
            }
        })
    }
}