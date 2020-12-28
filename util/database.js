const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = callback => {
  return MongoClient.connect(
    'mongodb+srv://malik:pokloniba@pokloni.zso6v.mongodb.net/Pokloni?retryWrites=true&w=majority'
  )
    .then(client => {
      console.log(client);
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
const getDb = () => {
  if (_db) return _db;
  throw 'No database found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
