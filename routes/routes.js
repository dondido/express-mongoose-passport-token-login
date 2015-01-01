var merge = require('merge'),
    exist = require(__dirname + '/../custom_modules/module-exist'),
    mailer = require('express-mailer'),
    emailCfg = exist(__dirname + "/../private/emailcfg.js") || {
      to: 'gmail.user@gmail.com',
      auth: {
              user: 'gmail.user@gmail.com',
              pass: 'userpass'
          }
    }

module.exports = function (app, passport, Account) {
    // Initialize the data
    mailer.extend(app, merge({
        host: 'smtp.gmail.com', // hostname
        secureConnection: true, // use SSL
        port: 465, // port for secure SMTP
        transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    }, emailCfg));

    app.get('/', function (req, res) {

        if(req.cookies.remember === '0') {
            // This user should log in again after restarting the browser
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
        res.clearCookie('remember');
        res.redirect('back');
    });

    /* Token key is generated and sent to the email address provided by the user. */
    app.post('/forgotten', function(req, res) {

        Account.findByUsername(req.body.email, function(err, existingUser) {
            app.mailer.send(
            'email',
            {
                to: req.body.email, // REQUIRED. This can be a comma delimited string just like a normal email to field.
                subject: 'Password token',
                token: req.csrfToken()
            },
            function (err) {
                var emailstatus = 'submit-success';
                if (err) {
                  // handle error
                  console.log('There was an error sending the email');
                  emailstatus = 'submit-fail';
                }
                console.log("submit-success", req.csrfToken())
                res.render('forgotten', {email: req.body.email});
            });
        });
    });

    /* Once the user has received the unique token, the token value needs to be
    entered when filling in the new password form. */
    app.post('/updatepass', function(req, res) {
        var rb = req.body;
        if (rb.new_password === rb.confirm_password){
            Account.findByUsername(
                req.body.email,
                function(err, user){
                    Account.updatePassword(
                        user,
                        rb.new_password,
                        function(){
                            res.redirect('/');
                        }
                    );
                }
            )
        }
    });

    app.post('/reset', function(req, res) {
        var rb = req.body;
        if (rb.new_password === rb.confirm_password){
            Account.authenticate()(
                req.user.email,
                rb.password,
                function(err, user){
                    Account.updatePassword(
                        user,
                        rb.new_password,
                        function(){
                            res.redirect('/');
                        }
                    );
                }
            );
        }
    });
};