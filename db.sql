create table events (
	id varchar(30) not null,
	type char(30),
	event_date date,
	created_at datetime,  
	repositoryUrl char(100),
	repositoryName  char(60),
	coder_id int,
	--CONSTRAINT FOREIGN KEY (coder_id) REFERENCES coders(id)
	PRIMARY KEY (id));
