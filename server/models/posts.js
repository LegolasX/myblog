let MongoManager = require('../lib/mongo');
let ObjectID = require('mongodb').ObjectID;

const COLLECTION = 'posts';

module.exports = {
    createPost: function (post) {
        return MongoManager.insertOne(COLLECTION, post);
    },
    getPostById: function (postId) {
        return MongoManager.findOne(COLLECTION, {
            _id: ObjectID(postId)
        });
    },
    getPostByUsername: function (username) {
        return MongoManager.find(COLLECTION, {
            username: username
        });
    }
}