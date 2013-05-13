var express = require('express')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , mongodb = require('mongodb')
  , mongoose = require('mongoose')
  , bcrypt = require('bcrypt')
  , SALT_WORK_FACTOR = 10;

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/nodestrap';

mongoose.connect(mongoUri);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Connected to DB');
});

// User Schema
var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
});

// Bcrypt middleware
userSchema.pre('save', function(next) {
	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
};

// Seed a user
var User = mongoose.model('User', userSchema);

var user = new User({
  username: 'admin',
  email: 'admin@gmail.com',
  password: 'admin'
});
user.save();


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));


var app = express();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(express.static(__dirname + '/public'));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});



/************************************/
/************* REST API *************/
/************************************/
// GET /api/users
app.get('/api/users', ensureAuthenticated, function(req,res){
  res.contentType('application/json');
  User.find({},function(err, users){
    if( err ) throw err;
    res.send( users )
  })
});

// GET /api/users/:username
app.get('/api/users/:username', ensureAuthenticated, function(req, res){
  res.contentType('application/json');
  User.findOne({username: req.params.username}, function(err, user ){
    if( user != null) {
      res.send( user )
    } else {
      res.render('404',{ title: 'Not Found'});
    }
  })
});


/* DELETE /api/users/:userid */
app.del('/api/users/:userid', ensureAuthenticated, function(req,res){
  User.remove({_id: req.params.userid }, function(err) {
    if(err) throw err;
    res.send(200,'User deleted');
    console.log('User deleted');
  });
});

/* POST /apo/users/add */
app.post( '/api/users/add' , ensureAuthenticated, function(req,res) {
  var user = new User({
    username: req.body.user.username,
    email: req.body.user.email,
    password: req.body.user.password
  });
  user.save(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.send(user);
      console.log('user: ' + user.username + " saved.");
    }
  });
});

/* PUT /api/users/:id */
app.put('/api/users/:id', ensureAuthenticated, function(req, res){
  return User.findById(req.params.id, function(err,user){
    user.username = req.body.user.username;
    user.email = req.body.user.email;
    if(req.body.user.password){
      user.password = req.body.user.password;
    }
    return user.save(function(err){
      if(!err){
        console.log("User updated");
      } else {
        console.log(err);
      }
      return res.send(user);
    })
  })
});
/************************************/
/*************** END REST ***********/
/************************************/


/* Routes */
app.get('/', ensureAuthenticated, function(req, res){
  res.render('index', { user: req.user, title: 'Welcome' });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user, title: 'Your account' });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user, message: req.session.messages, title: 'Login' });
});

// POST /login
//   This is an alternative implementation that uses a custom callback to
//   acheive the same functionality.
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.session.messages =  [info.message];
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log('Express server listening on port 3000');
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
