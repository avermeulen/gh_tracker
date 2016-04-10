
drop PROCEDURE if exists UserCommitsPerWeekForCurrentYear;

DELIMITER //

GO
    CREATE PROCEDURE UserCommitsPerWeekForCurrentYear ()

    BEGIN

    select username,
           week(created_at) as week,
           year(created_at) as year,
           count(*) as commitCount
    from coders join events
    where
        events.coder_id = coders.id
        and year(created_at) = year(now())
    group by username, year, week;

    END//

DELIMITER ;
