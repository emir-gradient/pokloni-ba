exports.landingPage = (req, res, next) => {
  res.render('index', {
    pageTitle: 'Poklanjam.ba'
  });
};
