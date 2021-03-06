var passport = require('passport'),
    signupController = require('../controllers/signupController.js'),
    dashboardController = require('../controllers/dashboardController.js'),
    admin = require('../../views/admin.handlebars'),
    db = require('sequelize'),
    moment = require('moment'),
    models = require('../model/models.js')


module.exports = function(express) {
  var router = express.Router()

  var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next()
    req.flash('error', 'You have to be logged in to access the page.')
    res.redirect('/')
  }

  router.get('/signup', signupController.show)
  router.post('/signup', signupController.signup)

  router.post('/login', passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/',
      failureFlash: true
  }))

  router.get('/admin', function(req, res) {
    models.User.findAll({
    }).then(function(users) {
      res.render('admin', {
        users: users
      });
    });
  });


  router.get('/audit', function(req, res) {
    models.User.findAll({
    }).then(function(users) {
      res.render('audit', {
        users: users
      });
    });
  });

  router.get('/', function(req, res) {
    res.render('home')
  })

  router.get('/dashboard', isAuthenticated, function(req, res) {
    models.Entry.findAll({
      where: {
        userId: req.user.id
      },
      order: [
        ['id']
      ]
    }).then(function(entries) {
      res.render('dashboard', {
        title: 'Helloooooo',
        username: req.user.username,
        entries: entries,
        now: moment(new Date()).format("YYYY-MM-DD"),
        moment: moment,
        times:
         ['00:15','00:30','00:45','01:00','01:15','01:30','01:45','02:00','02:15','02:30','02:45','03:00','03:15','03:30','03:45','04:00','04:15','04:30','04:45','05:00','05:15','05:30','05:45','06:00','06:15','06:30','06:45','07:00','07:15','07:30','07:45','08:00','08:15','08:30','08:45','09:00','09:15','09:30','09:45','10:00','10:15','10:30','10:45','11:00','11:15','11:30','11:45','12:00','12:15','12:30','12:45','13:00','13:15','13:30','13:45','14:00','14:15','14:30','14:45','15:00','15:15','15:30','15:45','16:00','16:15','16:30','16:45','17:00','17:15','17:30','17:45','18:00','18:15','18:30','18:45','19:00','19:15','19:30','19:45','20:00','20:15','20:30','20:45','21:00','21:15','21:30','21:45','22:00','22:15','22:30','22:45','23:00','23:15','23:30','23:45']
      });
    });
  });


  router.post('/dashboard', dashboardController.createEntry)

  router.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/')
  })

  return router
}
