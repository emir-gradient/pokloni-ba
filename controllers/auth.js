const User = require('../models/user');
const getDb = require('../util/database').getDb;
exports.getLogin = (req, res, next) => {
  res.render('login', {
    pageTitle: 'Pokloni.ba | Uloguj se'
  });
};
exports.postLogin = (req, res, next) => {
  let db = getDb();
  db.collection('users')
    .findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        console.log('User with such email does not exist');
        return res.redirect('/');
      }
      if (user.password.toString() === req.body.password.toString()) {
        req.session.user = user;
        req.session.isLoggedIn = true;
        console.log('You have succesfully logged in.');
        return res.redirect('/');
      } else {
        console.log('Wrong password');
        return res.redirect('/');
      }
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Nema sesije');
    }
    console.log('Logged out');
    res.redirect('/');
  });
};

exports.getSignup = (req, res, next) => {
  res.render('signup', {
    pageTitle: 'Pokloni.ba | Registruj se'
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = new User(email, password);
  user
    .save()
    .then(() => {
      console.log('User has signed up');
      return res.redirect('/login');
    })
    .catch(err => console.log(err));
};
