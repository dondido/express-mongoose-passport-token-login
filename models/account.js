var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    email: { 
        type: String, 
        required: true, 
        lowercase:true, 
        index: {unique: true} 
    },
    username: {type: String, required: true},
    created: {type: Date, default: Date.now},
});

Account.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model('Account', Account);