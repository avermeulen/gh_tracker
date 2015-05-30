var mysql = require('mysql');

module.exports = function(params){
    return mysql.createConnection({
        host     : params.host || 'localhost',
        user     : params.username || 'root',
        password : params.password || 'passw0rd',
        database : params.database || 'gh_tracker'
    });
}