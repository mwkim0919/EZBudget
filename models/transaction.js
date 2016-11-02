var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Transaction = new Schema({
	date: {type: Date, required: true},
	category: {type: String, required: false},
	amount: {type: Number, required: true},
	description: {type: String, required: false},
	type: {type: String, required: true},
	user: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Transaction', Transaction);