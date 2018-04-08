let MongoManager = require('../lib/mongo.js');
let ObjectID = require('mongodb').ObjectID;
const COLLECTION = 'category';

module.exports = {
    addCategory (category) {
        return MongoManager.insertOne(COLLECTION, category);
    },
    getCategoryByUsername (username) {
        return MongoManager.find(COLLECTION, {
            username
        })
    },
    modifyCategoryById (categoryId, categoryName) {
        return MongoManager.findOneAndUpdate(COLLECTION, {
            _id: ObjectID(categoryId)
        }, {
            $set: {
                categoryName: categoryName
            }
        })
    },
    deleteCategoryById (categoryId) {
        return MongoManager.remove(COLLECTION, {
            _id: ObjectID(categoryId)
        })
    }
}