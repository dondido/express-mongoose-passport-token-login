var exist = require(__dirname + '/../custom_modules/module-exist'),
    nodemailer = require('nodemailer');
    

module.exports = function (app, passport, Account) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465, secure: true, // port for secure SMTP
        // port: 587, secure: false, // true for 465, false for other ports
        /* Private email config file will not be available on git. This config file needs to be created. */
        auth: exist(__dirname + "/../private/emailcfg.js")
    });
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
                res.redirect('back');
            }
        );
    });

    app.post('/account', passport.authenticate('local'), function(req, res) {
        if (!req.body.remember){
            /* Each session has a unique cookie object accompany it. This allows
            us to alter the session cookie per visitor. We can set
            req.session.cookie.expires to false to enable the cookie to remain
            for only the duration of the user-agent. This user should log in
            again after restarting the browser. */
            req.session.cookie.expires = false;
        }
        res.redirect('back');
    });

    app.post('/logout', function(req, res) {
        /* Passport exposes a logout() function on reqthat can be called from
        any route handler which needs to terminate a login session. Invoking
        logout() will remove the req.user property and clear the login session
        (if any). This however does not set req.session.cookie.expires to its
        default value so req.session.destroy needs to be invoked. */
        req.logout();
        req.session.destroy();
        res.redirect('back');
    });

    /* Token key is generated and sent to the email address provided by the user. */
    app.post('/forgotten', function(req, res) {

        Account.findByUsername(req.body.email, function(err, existingUser) {
            async function sendMail() {
                var mailOptions = {
                    to: req.body.email, // list of receivers
                    text: req.csrfToken(),
                    subject: 'Password token',
                    from: '"Fred Foo 👻" <foo@example.com>',
                };
                // send mail with defined transport object
                var info = await transporter.sendMail(mailOptions);
                console.log("Message sent: %s", info.messageId);
                res.render('forgotten', {email: req.body.email});
            }
            sendMail().catch(console.error);
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