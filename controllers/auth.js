const User = require('../models/user');
const getDb = require('../util/database').getDb;
const bcrypt = require('bcryptjs');
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
        let htmlCode =
          '<html><head><title>Korisnik ne postoji</title></head><body><h1 style="font-family: Arial;">Korisnik sa upisanim emailom ili šifrom ne postoji.<br> Molimo vas kliknite na ovaj <a href="/login">Link</a> da se vratite na login formu</h1>';
        return res.send(htmlCode);
      }
      bcrypt.compare(req.body.password, user.password).then(doMatch => {
        if (doMatch) {
          req.session.user = user;
          req.session.isLoggedIn = true;
          return req.session.save(err => {
            console.log(err);
            let htmlCode =
              '<html><head><title>Korisnik pronađen</title></head><body><h1 style="font-family: Arial;">Uspješno ste se prijavili.<br> Molimo vas kliknite na ovaj <a href="/">Link</a> da se vratite na početnu stranicu</h1>';
            return res.send(htmlCode);
          });
        }
        let htmlCode =
          '<html><head><title>Korisnik ne postoji</title></head><body><h1 style="font-family: Arial;">Korisnik sa upisanim emailom ili šifrom ne postoji.<br> Molimo vas kliknite na ovaj <a href="/login">Link</a> da se vratite na login formu</h1>';
        return res.send(htmlCode);
      });
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
  let db = getDb();
  db.collection('users')
    .findOne({ email: email })
    .then(user => {
      if (user) {
        let htmlCode =
          '<html><head><title>Email zauzet</title></head><body><h1 style="font-family: Arial;">Upisani email je zauzet.<br> Molimo vas kliknite na ovaj <a href="/signup">Link</a> da se vratite na registraciju</h1>';
        return res.send(htmlCode);
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User(email, hashedPassword);
          return user
            .save()
            .then(() => {
              let htmlCode =
                '<html><head><title>Uspješna prijava</title></head><body><h1 style="font-family: Arial;">Uspješno ste se prijavili<br> Molimo vas kliknite na ovaj <a href="/login">Link</a> da se vratite na login formu</h1>';
              return res.send(htmlCode);
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    });
};
