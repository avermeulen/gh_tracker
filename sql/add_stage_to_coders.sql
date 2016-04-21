alter table coders add column stage_id int;

alter table coders add foreign key (stage_id) references coder_stages(id);
