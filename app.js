const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const mainRoutes = require('./routes/main');
const giftRoutes = require('./routes/gift');
const mongoConnect = require('./util/database').mongoConnect;
const errorController = require('./controllers/404');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/gifts', giftRoutes);
app.use(mainRoutes);
app.use(errorController);
mongoConnect().then(() => {
  app.listen(3000);
  console.log('Connected');
});
