var path = require('path'),
    express = require('express'),
    http = require('http'),
    /* This app uses sessions to remember whether the user is logged in or not.
    Using sessions to keep track of users as they journey through site is
    key to any respectable app. Sessions will accessible through the request 
    object in each route. */
    session = require('express-session'),
    /* When the node app restarts, all session related data will be lost.
    MongoStore allows us to store the Express sessions into MongoDB instead of 
    using the MemoryStore, which is a store for development use only, 
    bundled with Express. */
    MongoStore = require('connect-mongo')(session),
    /* The csurf middleware provides easy-to-use protection against 
    Cross Site Request Forgeries. */
    csrf = require('csurf'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    Account = require(__dirname +'/models/account'),
	app = express();

// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view options', { layout: false });


// Connect mongoose
mongoose.connect('mongodb://localhost/passport_local_csrf');

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
/* Secret to the session initialiser is provided, which adds a little 
more security for our session data. Of course you might what to use a 
key that is a little more secure. */
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
    res.send('Session has expired or form tampered with.');
})

app.use(express.static(path.join(__dirname, 'public')));

// Configure passport
passport.use(Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

require(__dirname +'/routes/routes')(app, passport, Account);

http.createServer(app).listen(8001);