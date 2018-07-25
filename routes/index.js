var express = require('express');
var router = express.Router();
var session = require('express-session');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var request = require('request');
var passport = require('passport');
var app = express();

// Posts model
var Posts = require('../models/article');

// User model
var User = require('../models/user');

// Months variable for date
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var the_date = new Date();


// Express session Middleware
router.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));


// Express Messages Middleware
router.use(require('connect-flash')());
router.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// Express Validator Middleware
router.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }

    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));


// Passport Config
require('../config/passport')(passport);
// Passport Middleware
router.use(passport.initialize());
router.use(passport.session());


// Set global variable for all pages
router.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});


/* GET home page. */
router.get('/', function(req, res, next) {
  Posts.find({}, function(err, posts){
    if (err){
        console.log(err);
    }
    else{
        res.render("index", {
            title: 'Blog Posts',
            posts: posts,
            navTitle: "STANCE|NATION"
        });
      }
    });  
});

/* GET archives page */
router.get('/archives', function(req, res, next){
  Posts.find({}, function(err, posts){
    if (err){
      console.log(err);
    }
    else{
      res.render("archives", {
        title: 'Archives',
        posts: posts
      })
    }
  })
})


/* GET New Blog Post page */
router.get('/new_post', ensureAuthenticated, function(req, res, next){

  let errors = req.validationErrors();

  res.render('new_post', {
    title: "New Blog Post",
    navTitle: "STANCE|NATION",
    errors: errors
  })
});


/* POST new blog post */
router.post('/new_post', ensureAuthenticated, function(req, res, next){

  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();
  req.checkBody('image', 'Image is required').notEmpty();

  // If errors, get errors
  let errors = req.validationErrors();
  if (errors) {
    res.render('new_post', {
      title: "New Blog Post",
      navTitle: "STANCE|NATION",
      errors: errors
    });
  }

  else {
    var post = new Posts();
    post.title = req.body.title;
    post.author = req.user._id;
    post.body = req.body.body;
    post.image = req.body.image;
    post.time = months[the_date.getMonth()] + " " + the_date.getDate() + " " + the_date.getFullYear();

    post.save(function(err){
        if (err){
          console.log(err);
          return;
        }
        else{
          req.flash('success', 'Blog Post Added');
          res.redirect('/');
        }
    });
  }
});


/* GET single blog post */
router.get('/post/:id', function(req, res, next){
  Posts.findById(req.params.id, function(err, posts){
    User.findById(posts.author, function(err, user){
      res.render('blog_post', {
        posts: posts,
        navTitle: "STANCE|NATION",
        author: user.name
      });
    })
  });
});


/* Edit blog post */
router.get('/edit_post/:id', ensureAuthenticated, function(req, res){
  Posts.findById(req.params.id, function(err, posts){
    if (posts.author != req.user._id) {
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_post', {
      title: "Edit Blog Post",
      posts: posts,
      navTitle: "STANCE|NATION"
    });
  });
});


/* Update submit post route */
router.post('/edit_post/:id', function(req, res){
  let post = {};
  post.title = req.body.title;
  post.body = req.body.body;
  post.image = req.body.image;

  let query = {_id:req.params.id};

  Posts.update(query, post, function(err){
      if (err){
          console.log(err);
          return;
      }
      else{
          res.redirect('/');
      }
  });
});


/* Delete post */
router.delete('/post/:id', function(req, res, next){
  if (!req.user._id ){
    res.status(500).send();
  }

  let query = {_id:req.params.id};

  Posts.findById(req.params.id, function(err, posts){
    if (posts.author != req.user._id) {
      res.status(500).send();
    }
    else{
      Posts.remove(query, function(err){
        if (err){
          console.log(err);
          return;
        }
        res.send("Successfully Deleted");
      })
    }
  });
});

// Access control
function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated){
    return next();
  }
  else{
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
