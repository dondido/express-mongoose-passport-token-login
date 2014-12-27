var path = require('path'),
    express = require('express'),
    http = require('http'),
    session = require('express-session'),
    csrf = require('csurf'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Account = require(__dirname +'/models/account'),
	app = express();

// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view options', { layout: false });

app.use(bodyParser.urlencoded({extended: false}));
app.use(
	session(
		{
		  secret: process.env.SESSION_SECRET || 'secret',
		  resave: false,
		  saveUninitialized: true
		}
	)
);

app.use(passport.initialize());
app.use(passport.session());

app.use(csrf());
// error handler for csrf tokens
app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') {
        return next(err);
    }
    // handle CSRF token errors here
    res.status(403);
    res.send('session has expired or form tampered with');
})

app.use(express.static(path.join(__dirname, 'public')));

// Configure passport
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

require(__dirname +'/routes/routes')(app, passport, Account);

// Connect mongoose
mongoose.connect('mongodb://localhost/passport_local_csrf');

http.createServer(app).listen(8001);