select username, repositoryName, max(created_at) from coders join events on events.coder_id = coders.id group by username  ;
