module.exports = function (app, passport, Account) {
   
    app.get('/', function (req, res) {
        if(req.cookies.remember === '0') {
            res.clearCookie('remember');
        }
        res.render(
            'index',
            {
                isAuthenticated: req.isAuthenticated() && req.cookies.remember,
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
                res.redirect('back');
            }
        );
    });

    app.post('/account', passport.authenticate('local'), function(req, res) {
        /* When the user successfully logs in a remember me cookie is issued 
        in addition to the standard session management cookie */
        res.cookie('remember', 
            req.body.remember ? '1' : '0', 
            { 
                maxAge: 900000, 
                httpOnly: true 
            }
        );
        res.redirect('back');
    });

    app.post('/logout', function(req, res) {
        req.logout();
        // This user should log in again after restarting the browser
        res.clearCookie('remember');
        res.redirect('back');
    });

};