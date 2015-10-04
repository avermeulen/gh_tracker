var mysql = require('mysql');

module.exports = function (dbParams, servicesSetup) {

    if (!dbParams) throw Error('Database parameters not supplied');
        if (!servicesSetup) throw Error('Service setup callback not supplied');

		this.dbParams = dbParams;
		var pool = mysql.createPool(dbParams);

        pool.on('connection', function (connection) {
            //connection.query('SET SESSION auto_increment_increment=1')
            console.log('new connection...')
        });

    var setupProvider = function(req, res, next){

  	var poolConnection;
  	req.services = function (callback) {

          pool.getConnection(function (err, connection) {
              if (err){
                return next(err);
              }
              poolConnection = connection;
              callback(null, servicesSetup(poolConnection));
          });
      };

  		var end = res.end;
  		res.end = function(data, encoding){
              if (poolConnection){
                console.log('closing connection')
              	poolConnection.release();
              }
              res.end = end;
              res.end(data, encoding);

  		};

    	next();
    }

	this.setupProvider = setupProvider;

};
