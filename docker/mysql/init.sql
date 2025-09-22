CREATE DATABASE IF NOT EXISTS `manoel_games_store` 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `manoel_games_store`;

CREATE USER IF NOT EXISTS 'manoel'@'%' IDENTIFIED BY 'manoel123';

GRANT ALL PRIVILEGES ON `manoel_games_store`.* TO 'manoel'@'%';

FLUSH PRIVILEGES;

SELECT 'Database manoel_games_store initialized successfully!' as Status;