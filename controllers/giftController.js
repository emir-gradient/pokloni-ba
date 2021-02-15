const path = require('path');
const Gift = require('../models/gift');
const fs = require('fs');
const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');
exports.getGifts = (req, res, next) => {
  console.log(req.session.user);
  Gift.fetchAll().then(gifts => {
    res.render('gifts', {
      pageTitle: 'Pokloni.ba | Lista poklona',
      gifts: gifts,
      path: '/gifts',
      user: req.session.user ? req.session.user : { isAdmin: false }
    });
  });
};

exports.getAddGift = (req, res, next) => {
  res.render('edit-gift', {
    pageTitle: 'Pokloni.ba | Dodaj poklon',
    editing: false,
    path: '/add-gift'
  });
};

exports.postAddGift = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  userId = req.session.user._id;
  const description = req.body.description.toString().trim();
  let gift;
  if (!image) gift = new Gift(title, null, description, userId);
  else gift = new Gift(title, image.path, description, userId);
  gift.save().then(() => {
    res.redirect('/gifts/list');
  });
};

exports.getEditGift = (req, res, next) => {
  const editing = req.query.editing;
  if (editing == 'true') {
    Gift.findById(req.params.giftId)
      .then(gift => {
        res.render('edit-gift', {
          pageTitle: 'Pokloni.ba | Uredi poklon',
          gift: gift,
          editing: true,
          path: '/edit-gift'
        });
      })
      .catch(err => console.log(err));
  } else if (editing == 'false') {
    res.redirect('/');
  }
};

exports.postEditGift = (req, res, next) => {
  const giftId = req.body.giftId;
  const title = req.body.title;
  const imageUrl = req.file;
  let gift;
  const description = req.body.description.toString().trim();
  if (!imageUrl)
    gift = new Gift(title, null, description, req.session.user._id, giftId);
  else
    gift = new Gift(
      title,
      imageUrl.path,
      description,
      req.session.user._id,
      giftId
    );
  gift.update().then(() => {
    res.redirect('/gifts/my-gifts');
  });
};

exports.postDeleteGift = (req, res, next) => {
  const giftId = req.body.giftId;
  Gift.findById(giftId).then(gift => {
    if (gift.imageUrl) {
      fs.unlink(
        path.join(__dirname, '../', 'images', gift.imageUrl.split('\\')[1]),
        err => {
          console.log(err);
        }
      );
    }
  });
  Gift.deleteById(giftId)
    .then(() => {
      console.log('Gift deleted');
      res.redirect('/gifts/list');
    })
    .catch(err => console.log(err));
};

exports.getMyGifts = (req, res, next) => {
  console.log(req.session);
  let db = getDb();
  return db
    .collection('pokloni')
    .find({ userId: new mongodb.ObjectId(req.session.user._id) })
    .toArray()
    .then(myGifts => {
      res.render('my-gifts', {
        pageTitle: 'Pokloni.ba | Moji pokloni',
        gifts: myGifts,
        path: '/my-gifts'
      });
    });
};

exports.getOrderGift = (req, res, next) => {
  if (!req.session.user) {
    let htmlCode =
      '<html><head><title>Narudžba nije uspjela</title></head><body><h1 style="font-family: Arial;">Morate biti prijavljeni korisnik da biste naručili poklon.<br> Molimo vas kliknite na ovaj <a href="/login">Link</a></h1>';
    return res.send(htmlCode);
  }
  let db = getDb();
  let order = {
    giftId: new mongodb.ObjectId(req.params.giftId),
    userId: req.session.user._id
  };
  db.collection('orders')
    .insertOne(order)
    .then(() => {
      let htmlCode =
        '<html><head><title>Narudžba nije uspjela</title></head><body><h1 style="font-family: Arial;">Uspješno ste poslali narudžbu.<br> Molimo vas kliknite na ovaj <a href="/">Link</a> da se vratite na početnu stranicu</h1>';
      return res.send(htmlCode);
    });
};
