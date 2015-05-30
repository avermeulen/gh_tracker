var mysql = require('mysql');

var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'passw0rd',
		database : 'gh_tracker'
	});




//connection.query("insert into repositories set ? ", [{repositoryName : "Test 2"}], function (err, r) {
connection.query("insert into repositories (repositoryName) values ? ", [[['test 22'], ['test 33'], ['test 44']]], 
  function (err, r) {
	console.log(err);
	if (!err)
		console.log("id : " + r.insertId);
	connection.destroy();
});