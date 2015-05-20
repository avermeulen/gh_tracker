drop table if exists coders;
drop table if exists events;
drop table if exists repositories;

create table coders (
    id int not null auto_increment primary key,
    firstName char(100),
    lastName char(100),
    email char(100),
    username char(100) unique
);

create table events(
    id int not null primary key,
    type char(30),
    event_date date,
    created_at datetime,
    repositoryUrl char(100),
    repositoryName char(60),
    coder_id int,

    CONSTRAINT FOREIGN KEY (coder_id) REFERENCES coders(id)
);

create table repositories (
    id int not null auto_increment null primary key,
    repositoryName char(60),
    created_at datetime,
    last_updated datetime,
    coder_id int,

    constraint foreign key (coder_id) references coders(id)
);

