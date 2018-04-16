let MongoManager = require('../lib/mongo');
let ObjectID = require('mongodb').ObjectID;

const COLLECTION = 'posts';

module.exports = {
    createPost: function (post) {
        post.categoryId = ObjectID(post.categoryId);
        return MongoManager.insertOne(COLLECTION, post);
    },
    getPostById: function (postId) {
        return MongoManager.findOne(COLLECTION, {
            _id: ObjectID(postId)
        });
    },
    getNextPostById: function (postId) {
        return MongoManager.find(COLLECTION, {
            _id: {
                $lt: ObjectID(postId)
            }
        })
    },
    getPostByCategoryId: function (categoryId) {
        return MongoManager.find(COLLECTION, {
            categoryId: ObjectID(categoryId)
        });
    },
    getPostByUsername: function (username) {
        return MongoManager.find(COLLECTION, {
            username: username
        });
    },
    updatePost: function (postId, post) {
        post.categoryId = ObjectID(post.categoryId);
        return MongoManager.findOneAndUpdate(COLLECTION, {
            _id: ObjectID(postId)
        }, {
            $set: post
        })
    },
    deletePost: function (postId) {
        return MongoManager.remove(COLLECTION, {
            _id: ObjectID(postId)
        })
    }
}