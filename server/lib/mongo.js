const config = require('../config/default');
const mongodb = require('mongodb');
const auth = require('./../config/auth');

let MongoManager = {
    _db: null,
    _conntectDb: async function (dbName) {
        if (this._db) {
            return this._db;
        }
        this._client = await mongodb.MongoClient.connect(config.mongodb.url);
        this._db = await this._client.db(dbName ? dbName : config.mongodb.dbName);
        return this._db;
    },
    _getNextSequenceValue: async function (sequenceName){
        let sequenceDocument = await this._db.collection('counters').findOneAndUpdate({
            '_id': sequenceName
        }, {
            $inc: {
                sequence_value: 1
            }
        });
        return sequenceDocument.value.sequence_value;
     },
    insertOne: async function (collection, document) {
        await this._conntectDb();
        /* let keyMap = {
            category: 'categoryId',
            posts: 'postId',
            users: 'userId',
            comments: 'commentId'
        }
        let id = await this._getNextSequenceValue(keyMap[collection]);
        document._id = id; */
        return this._db.collection(collection).insertOne(document);
    },
    find: async function (collection, document) {     
        await this._conntectDb();
        return await this._db.collection(collection).find(document).toArray();
    },
    findOne: async function (collection, document) {
        await this._conntectDb();
        return await this._db.collection(collection).findOne(document);
    },
    findOneAndUpdate: async function (collection, document, update) {
        await this._conntectDb();
        return this._db.collection(collection).findOneAndUpdate(document, update)
    },
    remove: async function (collection, document) {
        await this._conntectDb();
        return this._db.collection(collection).remove(document)
    }
}

async function getDoc () {
    let result = await MongoManager.findOneAndUpdate('comments', {
        '_id': 0
    }, {
        $inc: {
            voteCount: -1
        }
    })
    console.log(result);
}

function removeTest () {
    MongoManager.remove('users', {
        username: 'safd'
    }).then(result => {
        console.log(result);
    })
}
// removeTest();
// getDoc()

module.exports = MongoManager;



/* const MongoClient = require('mongodb').MongoClient;

let MongoManager = {
    _connectMongo: function (callback) {
        return MongoClient.connect(config.mongodb.url);
    },
    insertOne: function (collection, document) {
        return this._connectMongo().then(function (client) {
            return client.db(config.mongodb.dbName)
                .collection(collection)
                .insertOne(document);
        })
    },
    find: function (collection, document) {

    }
}

module.exports = MongoManager; */