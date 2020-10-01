var path = require('path'),
    express = require('express'),
    https = require('https'),
    fs = require('fs'),
    /* This app uses sessions to remember whether the user is logged in or not
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
    /* Here we find an appropriate database to connect to, defaulting to
    localhost if we don't find one. */
    uristring = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost:27017/passport_local_csrf',
    passport = require('passport'),
    /* The http server will listen to an appropriate port,
    or default to port 8001. */
    port = process.env.PORT || 8001,
    favicon = require('serve-favicon'),
    compression = require('compression'),
    Account = require(__dirname +'/models/account'),
	app = express();

// Configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('view options', { layout: false });

app.use(favicon(__dirname + '/public/img/icon/favicon.ico'));

// Switch off the default 'X-Powered-By: Express' header
app.disable('x-powered-by');

// compress all requests
app.use(compression());
/* Makes connection asynchronously.  Mongoose will queue up database
operations and release them when the connection is complete. */
mongoose.connect(uristring, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('You are connected!');
});

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
            saveUninitialized: true,
            cookie : {
                maxAge : 7 * 24 * 60 * 60 * 1000 // seconds which equals 1 week
            }
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

//http.createServer(app).listen(port);
https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app)
.listen(port, function () {
    console.log(`Example app listening on port ${port}! Go to https://localhost:${port}/`)
});