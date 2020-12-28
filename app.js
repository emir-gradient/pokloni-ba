const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mainRoutes = require('./routes/main');
const mongoConnect = require('./util/database').mongoConnect;
const errorController = require('./controllers/404');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mainRoutes);
app.use(errorController);
mongoConnect(() => {
  app.listen(3000);
  console.log('Connected');
});
