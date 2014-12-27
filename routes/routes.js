module.exports = function (app, passport, Account) {
   
    app.get('/', function (req, res) {
        res.render(
            'index',
            {
                isAuthenticated: req.isAuthenticated(),
                csrfToken: req.csrfToken()
            }
        );
    });

    app.post('/register', function(req, res) {
        Account.register(
            new Account(
                {
                    username: req.body.fullname,
                    email: req.body.email
                }
            ),
            req.body.password, 
            function(err) {
                if (err) { 
                    console.log('error while user register!', err); 
                    return next(err);
                }
                console.log('user registered!');
                res.redirect('/');
            }
        );
    });

    app.post('/account', passport.authenticate('local'), function(req, res) {
        res.redirect('/');
    });

    app.post('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

};