let MongoManager = require('../lib/mongo');

const COLLECTION = 'posts';

module.exports = {
    createPost: function (post) {
        return MongoManager.insertOne(COLLECTION, post);
    },
    getPostById: function (postId) {
        return MongoManager.findOne(COLLECTION, {
            _id: parseInt(postId)
        });
    },
    getPostByUsername: function (username) {
        return MongoManager.find(COLLECTION, {
            username: username
        });
    }
}