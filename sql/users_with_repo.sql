
drop PROCEDURE UsersWithRepos;

DELIMITER //

GO
    CREATE PROCEDURE UsersWithRepos ()

    BEGIN

        DROP TABLE IF EXISTS UserMaxIds;

        CREATE TEMPORARY TABLE UserMaxIds
            select
                coder_id as coderId, max(id) as eventId
            from events
            group by coder_id;

        select
            coders.id as coder_id,
            username as username,
            firstName as firstName,
            lastName as lastName,
            email,
            term,
            repositoryName as active_repo,
            created_at as last_active_at,
            datediff(date(now()), date(created_at)) active_days_ago
        from UserMaxIds
        join events on events.id = UserMaxIds.eventId
        join coders on coders.id = UserMaxIds.coderId
        order by events.id desc;

    END//

DELIMITER ;
