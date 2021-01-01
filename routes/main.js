const mainController = require('../controllers/mainController');
const express = require('express');
const router = express.Router();

router.get('/', mainController.landingPage);

router.post('/add-gift', mainController.postAddGift);
router.get('/add-gift', mainController.getAddGift);

router.post('/edit-gift', mainController.postEditGift);
router.get('/edit-gift/:giftId', mainController.getEditGift);

router.post('/delete-gift', mainController.postDeleteGift);

router.get('/gifts', mainController.getGifts);

module.exports = router;
