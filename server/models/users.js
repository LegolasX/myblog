let MongoManager = require('../lib/mongo');

const CONST = require('../util/code.const')
const COLLECTION = 'users';

module.exports = {
    createUser: async function (user) {
        let doc = await MongoManager.findOne(COLLECTION, {
            username: user.username
        });
        if (doc) {
            return Promise.resolve({
                errorMessage: CONST.ERROR_MESSAGE_USER_EXITS
            });
        } else {
            return MongoManager.insertOne(COLLECTION, user);
        }
    },
    getUserProfile (username) {
        return MongoManager.findOne(COLLECTION, {
            username
        });
    },
    updateUserProfile (username) {
        
    },
    login: async function (user) {
        let doc = await MongoManager.findOne(COLLECTION, {
            username: user.username,
            password: user.password
        });
        if (doc) {
            return true;
        } else {
            return false;
        }
    }
}
