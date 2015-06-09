create table coders(
	id int auto_increment not null,
	firstName char(100),
	lastName char(100),
	email char(100),
	username char(100) unique,
	primary key(id)
);

create table events (
	id varchar(30) not null,
	type char(30),
	event_date date,
	created_at datetime,  
	repositoryUrl char(100),
	repositoryName  char(60),
	coder_id int,
	constraint foreign key (coder_id) references coders(id),
	primary key (id)
);
