let MongoManager = require('../lib/mongo.js');

const COLLECTION = 'category';

module.exports = {
    addCategory (category) {
        return MongoManager.insertOne(COLLECTION, category);
    },
    getCategoryByUsername (username) {
        return MongoManager.find(COLLECTION, {
            username
        })
    }
}