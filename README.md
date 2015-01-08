express-mongoose-passport-token-login
=====================================

## Synopsis

User session and token authentication node.js app with express 4, mongoose, passport, passport-local, passport-local-mongoose, express-session and csurf.

## Motivation

Authentication is one of the most important parts of any web application. Implementing proper authentication system for any application can be a difficult task and Node.js applications are no exception to this. To address security concerns of exposing a user's login information, this example uses sessions and tokens authentication methods. It can be used as boilerplate for Node.js projects using Express 4, MongoDB, Passport, Express Session and Csurf REST API Auth Tokens.

This example uses the following flow of control:

The user provides a user password and email in the login panel and clicks Sign In. The email provided will be used for further session tracking of information that is needed to persist throughout the user's interaction with the web application. Instead of storing information via cookies in the user's browser, only a unique identifier is stored on the client side (called a "session id"). This session id is passed to the server every time HTTP or AJAX request is made. The Node.js app pairs this session id with it's database (in our case MongoDB) and retrieves the stored variables for use by the requested page. Using Express Session middleware takes the complexity away and makes it simple to get sessions up and running in no time. 

After a request is complete, the server reports back on the request's success or failure user validation. If the request is valid, token is created using the user information fetched from the database, and then returned inside the view (ejs template engine is demonstrated here). The token value is set as the value of a hidden input field. Tokens are added to requests which mutate state and validated against the visitor's session. Only if correct token is present and correct, changes will be applied, otherwise the request will be rejected. Token information is provided only in POST requests for accessing restricted endpoints in the application, since GET requests can leak the token to different places (browser history, log files, etc.). The CSURF middleware provides easy-to-use protection against CSRF/XSRF attacks.

Once user logs out, session will be destroyed and user will be redirected to home page.

This app provides a "Remember Me" feature that saves the user's session data allowing them to bypass the login screen whenever they revisit the site (their authenticated state is persisted beyond the immediate scope of use). If "Remember me" checkbox on the login page is selected, the session expiration will be extended to a week and otherwise it is just treated as a normal window session that does not have an explicit expiration date and will therefore forcibly expire when the browser is closed. 

By employing the practice of progressive enhancement the app honours accessibility while taking advantage of cutting edge technology. It’s the best of both worlds.


## Installation

Once you have forked this project, go ahead and install our dependencies by simply typing the following line in your terminal:

```js
npm install
```
Now let's start the app:
```js
npm start
```

In order to automate the workflow and build processes for deployment we use Grunt. The task runner help us minify and compress our assets to improve site’s performance and prepare it for production:

```js
grunt
```

And here is how you run the app in production mode:

```js
node_env=PRODUCTION npm start
```


## License

MIT License

Copyright (c) 2014 Dian Dimitrov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
