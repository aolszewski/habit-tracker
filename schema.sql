-- Drops the habits_db if it exists currently --
DROP DATABASE IF EXISTS habits_db;


-- Creates the "habits_db" database --
CREATE DATABASE habits_db;

CREATE TABLE IF NOT EXISTS `Users` (
    `id` INTEGER NOT NULL auto_increment , 
    `email` VARCHAR(255) NOT NULL UNIQUE, 
    `password` VARCHAR(255) NOT NULL, 
    `createdAt` DATETIME NOT NULL, 
    `updatedAt` DATETIME NOT NULL, 
    PRIMARY KEY (`id`)) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Habits` (
    `id` INTEGER NOT NULL auto_increment , 
    `name` VARCHAR(255) NOT NULL, 
    `completed` TINYINT(1) NOT NULL, 
    `createdAt` DATETIME NOT NULL, 
    `updatedAt` DATETIME NOT NULL, 
    `UserId` INTEGER NOT NULL, 
    PRIMARY KEY (`id`), 
    FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE) ENGINE=InnoDB;