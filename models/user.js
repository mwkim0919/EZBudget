var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passportLocalMongoose');

var User = new Schema({
	name: String,
	email: String,
	password: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', User);