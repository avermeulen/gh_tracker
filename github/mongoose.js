var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var RepositorySchema = new Schema({
	name : String,
	created : String,
	updated : String
});

var ActivitySchema = new Schema({
	type : String,
	repositoryUrl : String,
	repositoryName : String,
	created : String
});

var CoderSchema = new Schema({
	firstName : String,
	lastName : String,
	username : String,
	repositories : [RepositorySchema],
	activities : [ActivitySchema]

});

mongoose.connect('mongodb://localhost/gh_tracker');

var db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error:', err.message);
});
db.once('open', function callback () {
    console.log("Connected to DB!");
});

var Coder = mongoose.model('Coders', CoderSchema);

exports.Coder = Coder;

//var Coder