var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    database: 'localhost',
    user: 'xxxx',
    password: 'xxxx'
});
module.exports = pool;

/*

CREATE TABLE `localhost`.`link_manage` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `status` VARCHAR(10) NULL COMMENT '-1: die, 0: ready, 1:crawling, 9: fail, 10:crawled' ,
  `executor` VARCHAR(45) NULL,
  `host` VARCHAR(100) NULL,
  `url` VARCHAR(225) NULL,
  `create_date` DATETIME NULL,
  `update_date` DATETIME NULL
  PRIMARY KEY (`id`));

  ADD INDEX `url_index` (`url` ASC),
  ADD INDEX `host_index` (`host` ASC),
  ADD INDEX `status_index` (`status` ASC);
  
  
  ------------------------------------------
  
  CREATE TABLE `localhost`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));
  
  INSERT INTO `localhost`.`users` (`user_name`, `email`) VALUES ('Vic Huang', 'xxx@gmail.com');


  
  */
  
  
  