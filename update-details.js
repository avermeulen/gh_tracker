module.exports = function (connection, io) {
	
	connection.on('error', function(err) {
	  console.log(err.code); // 'ER_BAD_DB_ERROR'
	});
	
	this.updateUserEvents = function (event) {
		
		//check if the last event is in the database		
		connection.query("select id from events where id = ?", event.id, function (err, eventData) {
			if (err){
				return io.emit('error', err);
			}
			
			if(eventData.length !== 0){
				return;
			}
			
			connection.query("select id from coders where username = ?", event.user, function (err, user) {
				if(err)
					return;
				
				var eventData = {
					id : Number(event.id),
					coder_id : user[0].id,
					type : event.type,
					repositoryUrl : event.repo,
					repositoryName : event.repo_name,
					created_at : event.created_at
				};
				
				var query = connection.query("insert into events set ?", eventData, function(err, evtData){
					
					console.log(arguments);
					
                	if (err){
						console.log("insert events : " + err);
						io.emit('error', err);
						return;
					}
					io.emit('events_updated', { username : event.user});
            	});	
			});
			//add it if it is not there	
			
		});
		
	};
	
};