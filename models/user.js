var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
	username: String,
	password: String,
	transactions: [{type: Schema.Types.ObjectId, ref: 'Transaction'}]
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);