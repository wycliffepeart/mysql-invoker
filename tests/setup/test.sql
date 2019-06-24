# Create test database
drop database if exists `invoker`;
create database if not exists `invoker`;

-- Grant the necessary permissions for the provisioner
GRANT
  CREATE,
  ALTER,
  DROP,
  CREATE ROUTINE,
  ALTER ROUTINE,
  CREATE VIEW,
  ALTER,
  SELECT,
  INSERT,
  UPDATE,
  DELETE,
  SHOW VIEW,
  TRIGGER,
  REFERENCES,
  EXECUTE
  ON `invoker`.* TO `provisioner`;

-- Grant the necessary permissions for the application.
GRANT
  EXECUTE,
  SELECT
  ON `invoker`.* TO `application`;

# Create user table
drop table if exists `invoker`.`user`;
create table if not exists `invoker`.`user`
(
  id   bigint unsigned primary key auto_increment,
  name varchar(255)
);

# Create stored procedure to insert an user

delimiter $$

drop procedure if exists `invoker`.`createUser`;
create
  definer = 'provisioner' procedure `invoker`.`createUser`
(
  in `$name` varchar(255)
)
begin

  insert into `invoker`.`user` (`name`) values (`$name`);

  select * from `invoker`.`user` where `user`.`id` = last_insert_id();

end $$

delimiter ;

# Create stored procedure to list all user

delimiter $$

drop procedure if exists `invoker`.`listUser`;
create
  definer = 'provisioner' procedure `invoker`.`listUser`
(
  in `$limit` tinyint unsigned,
  in `$offset` tinyint unsigned
)
begin

  select * from `invoker`.`user` limit `$limit` offset `$offset`;

end $$

delimiter ;

# Create stored procedure to read a given user

delimiter $$

drop procedure if exists `invoker`.`readUser`;
create
  definer = 'provisioner' procedure `invoker`.`readUser`
(
  in `$id` bigint unsigned
)
begin

  select * from `invoker`.`user` where `user`.`id` = `$id`;

end $$

delimiter ;

# Create stored procedure to update an user

delimiter $$

drop procedure if exists `invoker`.`updateUser`;
create
  definer = 'provisioner' procedure `invoker`.`updateUser`
(
  in `$id` bigint unsigned,
  in `$name` varchar(255)
)
begin

  update `invoker`.`user` set `user`.`name` = `$name` where `user`.`id` = `$id`;

  select * from `invoker`.`user` where `user`.`id` = `$id`;

end $$

delimiter ;

/* Create stored procedure to delete a given user*/

delimiter $$

drop procedure if exists `invoker`.`deleteUser`;
create
  definer = 'provisioner' procedure `invoker`.`deleteUser`
(
  in `$id` bigint unsigned
)
begin

  select * from `invoker`.`user` where `user`.`id` = `$id`;

  delete from `invoker`.`user` where `user`.`id` = `$id`;

end $$

delimiter ;






