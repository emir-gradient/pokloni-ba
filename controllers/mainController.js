const Gift = require('../models/gift');
exports.landingPage = (req, res, next) => {
  res.render('index', {
    pageTitle: 'Poklanjam.ba'
  });
};

exports.postAddGift = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const gift = new Gift(title, imageUrl, description);
  gift.save().then(() => {
    res.redirect('/gifts');
  });
};

exports.getAddGift = (req, res, next) => {
  res.render('edit-gift', {
    pageTitle: 'Dodaj poklon',
    editing: false
  });
};

exports.postEditGift = (req, res, next) => {
  const giftId = req.body.giftId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const gift = new Gift(title, imageUrl, description, giftId);
  gift.update();
  res.redirect('/gifts');
};

exports.getEditGift = (req, res, next) => {
  const editing = req.query.editing;
  if (editing) {
    Gift.findById(req.params.giftId)
      .then(gift => {
        res.render('edit-gift', {
          pageTitle: 'Uredi poklon',
          gift: gift,
          editing: true
        });
      })
      .catch(err => console.log(err));
  } else if (!editing) {
    res.redirect('/');
  }
};

exports.postDeleteGift = (req, res, next) => {
  const giftId = req.body.giftId;
  Gift.deleteById(giftId)
    .then(() => {
      console.log('Gift deleted');
      res.redirect('/gifts');
    })
    .catch(err => console.log(err));
};

exports.getGifts = (req, res, next) => {
  Gift.fetchAll().then(gifts => {
    res.render('gifts', {
      pageTitle: 'Pokloni',
      gifts: gifts
    });
  });
};
