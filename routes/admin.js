const router = require('express').Router();
const adminController = require('../controllers/admin');

router.post('/add-new-admin', adminController.postAddNewAdmin);

router.post('/delete-admin', adminController.postDeleteAdmin);

module.exports = router;
