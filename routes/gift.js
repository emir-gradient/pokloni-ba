const giftController = require('../controllers/giftController');
const router = require('express').Router();

router.post('/add-gift', giftController.postAddGift);
router.get('/add-gift', giftController.getAddGift);

router.post('/edit-gift', giftController.postEditGift);
router.get('/edit-gift/:giftId', giftController.getEditGift);

router.post('/delete-gift', giftController.postDeleteGift);

router.get('/list', giftController.getGifts);

module.exports = router;
