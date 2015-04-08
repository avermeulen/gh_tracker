
module.exports = function(app){

	var mysql = require('mysql'), 
    myConnection = require('express-myconnection');

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