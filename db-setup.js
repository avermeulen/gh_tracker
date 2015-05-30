var mysql = require('mysql');
var myConnection = require('express-myconnection');

module.exports = function(app){

	var dbOptions = {
	      host: 'localhost',
	      user: 'gh',
	      password: 'password',
	      port: 3306,
	      database: 'gh_tracker'
	};

	//setup middleware
	app.use(myConnection(mysql, dbOptions, 'single'));

}