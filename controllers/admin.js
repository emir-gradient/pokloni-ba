const getDb = require('../util/database').getDb;
const User = require('../models/user');
exports.postAddNewAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    const email = req.body.email;
    let db = getDb();
    db.collection('users')
      .findOne({ email: email })
      .then(user => {
        if (!user) {
          console.log('User not found');
          return res.redirect('/');
        }
        user.isAdmin = true;
        return db
          .collection('users')
          .updateOne({ email: email }, { $set: { isAdmin: true } });
      })
      .then(() => {
        console.log('User has been added as admin');
        res.send('User added as admin');
      });
  } else {
    res.redirect('/404');
  }
};

exports.postDeleteAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    const email = req.body.email;
    let db = getDb();
    return db
      .collection('users')
      .findOne({ email: email })
      .then(user => {
        if (!user) {
          res.send('User not found');
          return res.redirect('/');
        }
        if (!user.isAdmin) {
          return res.send('User is not an admin');
        }
        db.collection('users')
          .updateOne({ email: email }, { $set: { isAdmin: false } })
          .then(() => {
            res.send('User is not an admin anymore.');
          });
      });
  } else {
    res.redirect('/404');
  }
};
