SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- User table to track the users who have joined the platform 

CREATE OR REPLACE TABLE Users
(
    user_id     int AUTO_INCREMENT,
    username    varchar(255) NOT NULL,
    user_email  varchar(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    date_joined date NOT NULL,
    PRIMARY KEY (user_id)
);

-- Restaurants table 

CREATE OR REPLACE TABLE Restaurants 
(
    restaurant_id    int AUTO_INCREMENT,
    user_id          int, 
    name             varchar(255) NOT NULL,
    location         varchar(255) NOT NULL,
    cuisine_type     varchar(255) NOT NULL,
    rating           decimal (3,1),
    review           text NULL,
    PRIMARY KEY      (restaurant_id),
    FOREIGN KEY      (user_id)        REFERENCES Users(user_id) ON DELETE CASCADE 
);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
