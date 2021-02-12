const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }
  save() {
    let db = getDb();
    return db
      .collection('users')
      .insertOne(this)
      .then(() => console.log('User has been added to the database.'))
      .catch(err => console.log(err));
  }
  static findById(id) {
    let db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new mongodb.ObjectID(id) })
      .then(() => console.log('User fetched.'))
      .catch(err => console.log(err));
  }
  static deleteById(id) {
    let db = getDb();
    return db
      .collection('users')
      .deleteOne({ _id: new mongodb.ObjectID(id) })
      .then(() =>
        console
          .log('User has been deleted from the database')
          .catch(err => console.log(err))
      );
  }
}

module.exports = User;
