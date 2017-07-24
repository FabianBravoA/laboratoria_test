const mongoose = require('mongoose');

var EntrySchema = new mongoose.Schema({
	userId 			: String,
	message 		: String,
	privacyLevel 	: String,
	timestamp 		: Date
});

module.exports = mongoose.model('Entry', EntrySchema);