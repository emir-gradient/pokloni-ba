const path = require('path');
const Gift = require('../models/gift');
const fs = require('fs');
const { COPYFILE_FICLONE_FORCE } = require('constants');
exports.getGifts = (req, res, next) => {
  Gift.fetchAll().then(gifts => {
    res.render('gifts', {
      pageTitle: 'Pokloni.ba | Lista poklona',
      gifts: gifts,
      path: '/gifts'
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
  const description = req.body.description.toString().trim();
  let gift;
  if (!image) gift = new Gift(title, null, description);
  else gift = new Gift(title, image.path, description);
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
  if (!imageUrl) gift = new Gift(title, null, description, giftId);
  else gift = new Gift(title, imageUrl.path, description, giftId);
  gift.update().then(() => {
    res.redirect('/gifts/list');
  });
};

exports.postDeleteGift = (req, res, next) => {
  const giftId = req.body.giftId;
  Gift.findById(giftId).then(gift => {
    fs.unlink(
      path.join(__dirname, '../', 'images', gift.imageUrl.split('\\')[1]),
      err => {
        console.log(err);
      }
    );
  });
  Gift.deleteById(giftId)
    .then(() => {
      console.log('Gift deleted');
      res.redirect('/gifts/list');
    })
    .catch(err => console.log(err));
};
