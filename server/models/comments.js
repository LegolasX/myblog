let MongoManager = require('../lib/mongo.js');

const COLLECTION = 'comments';

module.exports = {
    addComment (comments) {
        return MongoManager.insertOne(COLLECTION, comments);
    },
    getCommentsByPostId (postId) {
        return MongoManager.find(COLLECTION, {
            postId
        });
    },
    voteOrDislikeComment (commentId, vote) {
        if (vote) {
            return MongoManager.findOneAndUpdate(COLLECTION, {
                '_id': commentId
            }, {
                $inc: {
                    voteCount: 1
                }
            });
        } else {
            return MongoManager.findOneAndUpdate(COLLECTION, {
                '_id': commentId
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
                '_id': commentId
            }, {
                $inc: {
                    voteCount: -1
                }
            });
        } else {
            return MongoManager.findOneAndUpdate(COLLECTION, {
                '_id': commentId
            }, {
                $inc: {
                    dislikeCount: -1
                }
            });
        }
    },
    replyComment (commentId, comment) {
        return MongoManager.findOneAndUpdate(COLLECTION, {
            '_id': commentId
        }, {
            $push: {
                replyList: comment
            }
        })
    }
}