var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/user');

var Transaction = new Schema({
	date: {type: Date, required: true},
	category: {type: String, required: false},
	amount: {type: Number, required: true},
	description: {type: String, required: false},
	type: {type: String, required: true},
	user: {type: Schema.Types.ObjectId, ref: 'User'}
});

Transaction.post('remove', function(doc) {
	var deletedTransaction = doc;
	console.log(doc);
	User.findById(doc.user, function(err, doc) {
		doc.transactions.pull(deletedTransaction);
		doc.save();
	});
});

module.exports = mongoose.model('Transaction', Transaction);