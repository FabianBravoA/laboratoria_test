var express = require('express');
var router = express.Router();
var Entry = require('../models/entry');

router.get('/list', function(req, res, next) {
  	Entry.find({
  		userId : req.user.id
  	}).then(function(entries){
  		res.json(entries);
  	}).catch(function(error){
  		res.status(500);
  		res.json({
  			message : "Error while retrieving entries for this user"
  		});
  	});
});

router.post('/', function(req, res, next){
	var newEntry = new Entry();
	newEntry.userId = req.user.id;
	newEntry.message = req.body.message;
	newEntry.privacyLevel = req.body.privacyLevel == "Amigos" ? "Amigos" : "Público";
	newEntry.timestamp = Date.now();

	newEntry.save().then(function(entry){
		res.json(entry.toObject());
	}).catch(function(error){
		res.status(500);
		res.json({
			message : "Couldn't save new entry for this user"
		});
	});
});

router.put('/:entryId', function(req, res, next){
	Entry.findOne({
		_id : req.params['entryId']
	}).then(function(entry){
		if(entry){
			entry.message = req.body.message;
			return entry.save();
		}else{
			throw new Error("Couldn't find entry to edit");
		}
	}).then(function(entry){
		res.json(entry.toObject())
	}).catch(function(error){
		res.status(500);
		res.json({
			message : "Couldn't edit this entry"
		});
	});
});

router.delete('/:entryId', function(req, res, next){
	Entry.findByIdAndRemove({
		_id : req.params['entryId']
	}).then(function(entry){
		res.json({
			message : "Entry deleted!"
		});
	}).catch(function(error){
		res.status(500);
		res.json({
			message : "Couldn't edit this entry"
		});
	});
});

module.exports = router;