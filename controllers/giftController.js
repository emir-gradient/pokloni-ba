const Gift = require('../models/gift');

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
  const imageUrl = req.body.imageUrl;
  const description = req.body.description.toString().trim();
  const gift = new Gift(title, imageUrl, description);
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
  const imageUrl = req.body.imageUrl;
  const description = req.body.description.toString().trim();
  const gift = new Gift(title, imageUrl, description, giftId);
  gift.update();
  res.redirect('/gifts/list');
};

exports.postDeleteGift = (req, res, next) => {
  const giftId = req.body.giftId;
  Gift.deleteById(giftId)
    .then(() => {
      console.log('Gift deleted');
      res.redirect('/gifts/list');
    })
    .catch(err => console.log(err));
};
