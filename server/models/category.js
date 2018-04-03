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
    },
    modifyCategoryById (categoryId, categoryName) {
        categoryId = typeof categoryId !== 'number' ? parseInt(categoryId) : categoryId;
        return MongoManager.findOneAndUpdate(COLLECTION, {
            _id: categoryId
        }, {
            $set: {
                categoryName: categoryName
            }
        })
    },
    deleteCategoryById (categoryId) {
        categoryId = typeof categoryId !== 'number' ? parseInt(categoryId) : categoryId;
        return MongoManager.remove(COLLECTION, {
            _id: categoryId
        })
    }
}