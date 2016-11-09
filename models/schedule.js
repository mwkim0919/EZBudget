var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/user');

var Schedule = new Schema({
	title: {type: String, required: true},
	startDate: {type: Date, required: true},
	endDate: {type: Date, required: true},
	category: {type: String, required: false},
	description: {type: String, required: false},
	user: {type: Schema.Types.ObjectId, ref: 'User'}
});

Schedule.post('remove', function(doc) {
	var deletedSchedule = doc;
	console.log(doc);
	User.findById(doc.user, function(err, doc) {
		doc.schedules.pull(deletedSchedule);
		doc.save();
	});
});

module.exports = mongoose.model('Transaction', Transaction);