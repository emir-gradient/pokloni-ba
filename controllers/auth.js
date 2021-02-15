const User = require('../models/user');
const getDb = require('../util/database').getDb;
exports.getLogin = (req, res, next) => {
  res.render('login', {
    pageTitle: 'Pokloni.ba | Uloguj se'
  });
};
exports.postLogin = (req, res, next) => {
  if (!req.body.password) {
    let htmlCode =
      '<html><head><title>Korisnik ne postoji</title></head><body><h1 style="font-family: Arial;">Upišite šifru.<br> Molimo vas kliknite na ovaj <a href="/login">Link</a> da se vratite na login formu</h1>';
    return res.send(htmlCode);
  }
  let db = getDb();
  db.collection('users')
    .findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        console.log('User with such email does not exist');
        let htmlCode =
          '<html><head><title>Korisnik ne postoji</title></head><body><h1 style="font-family: Arial;">Korisnik sa upisanim emailom ili šifrom ne postoji.<br> Molimo vas kliknite na ovaj <a href="/login">Link</a> da se vratite na login formu</h1>';
        return res.send(htmlCode);
      }
      if (user.password.toString() === req.body.password.toString()) {
        req.session.user = user;
        req.session.isLoggedIn = true;
        let htmlCode =
          '<html><head><title>Korisnik pronađen</title></head><body><h1 style="font-family: Arial;">Uspješno ste se prijavili.<br> Molimo vas kliknite na ovaj <a href="/">Link</a> da se vratite na početnu stranicu</h1>';
        return res.send(htmlCode);
      } else {
        let htmlCode =
          '<html><head><title>Korisnik ne postoji</title></head><body><h1 style="font-family: Arial;">Korisnik sa upisanim emailom ili šifrom ne postoji.<br> Molimo vas kliknite na ovaj <a href="/login">Link</a> da se vratite na login formu</h1>';
        return res.send(htmlCode);
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
