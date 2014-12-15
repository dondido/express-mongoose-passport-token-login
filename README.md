express-mongoose-passport-token-login
=====================================

## Synopsis

User token authentication Node.js Application with express 4, mongoose, passport, passport-local, passport-local-mongoose and jwt-simple.

## Motivation

Authentication is one of the most important parts of any web application. Implementing proper authentication system for any application can be a difficult task and Node.js applications are no exception to this. To address security concerns of exposing a user's login information, this example uses "User Token" authentication method. This example can be used as boilerplate for Node.js projects using Express 4, MongoDB, Passport and JWT with REST API Auth Tokens.


This example uses the following flow of control:

The user provides a user email and password in the login panel and clicks Sign In.
After a request is complete, the server reports back on the request's success or failure user validation. If the request is valid, token is created using the user information fetched from the database, and then returned in the response header so that we can store the token in browser storage. Token information is provided in every request header for accessing restricted endpoints in the application. In the context of tokens being used on single page applications, when refreshing the browser what happens with the token issue crops up. The answer is simple: token has to be stored somewhere: in session storage, local storage or a client side cookie. In this case we are using browser cookies as a storage mechanism, not as an authentication mechanism (the cookie won't be used by the token-based REST API to authenticate a user, hence no XSRF attacks are possible).


## Installation

Once you have forked the project, you can run the app by simply typing the following line in your terminal:

```js
npm start
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
