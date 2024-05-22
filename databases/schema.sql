DROP DATABASE IF EXISTS cursova_db;
CREATE DATABASE cursova_db;
USE cursova_db;

-- for type of the flights:
-- внутрішні перельоти = 1
-- міжнародні перельоти = 2


CREATE TABLE visas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    country_code CHAR(2) NOT NULL UNIQUE,
    country VARCHAR(255) NOT NULL
);

CREATE TABLE black_list (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE,
    type TINYINT NOT NULL,
    CHECK ( type = 1 OR type = 2 )
);

CREATE TABLE passengers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_passport TINYINT DEFAULT 0, -- boolean
    created_at TIMESTAMP DEFAULT NOW(),
    CHECK ( is_passport = 0 OR is_passport = 1 )
);



CREATE TABLE terminals (
    id CHAR(1) PRIMARY KEY,
    flights_type TINYINT NOT NULL,
    CHECK ( flights_type = 1 OR flights_type = 2 )
);

CREATE TABLE planes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seats_count SMALLINT NOT NULL,
    allowed_luggage_weight FLOAT NOT NULL,
    allowed_luggage_volume FLOAT NOT NULL
);

CREATE TABLE flights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type TINYINT NOT NULL,
    destination_country_code CHAR(2),
    destination_city VARCHAR(255) NOT NULL,
    frequency SMALLINT NOT NULL,
    profitability SMALLINT NOT NULL,
    passengers_count SMALLINT DEFAULT 0,
    departure_date TIMESTAMP NOT NULL,
    arrival_date TIMESTAMP NOT NULL,
    plane_id INT NOT NULL,
    terminal_id CHAR(1) NOT NULL,
    FOREIGN KEY (plane_id) REFERENCES planes(id),
    FOREIGN KEY (terminal_id) REFERENCES terminals(id),
    CHECK ( type = 1 OR (type = 2 AND destination_country_code IS NOT NULL) )
);



CREATE TABLE passengers_on_board (
    id INT AUTO_INCREMENT PRIMARY KEY,
    passenger_id INT NOT NULL UNIQUE,
    flight_id INT NOT NULL,
    is_registration_success TINYINT DEFAULT 0, -- boolean
    visa_id INT,
    FOREIGN KEY (passenger_id) REFERENCES passengers(id),
    FOREIGN KEY (flight_id) REFERENCES flights(id),
    FOREIGN KEY (visa_id) REFERENCES visas(id),
    CHECK ( is_registration_success = 0 OR is_registration_success = 1 )
);

CREATE TABLE luggage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    passenger_on_board__id INT NOT NULL,
    weight FLOAT NOT NULL,
    volume FLOAT NOT NULL,
    FOREIGN KEY (passenger_on_board__id) REFERENCES passengers_on_board(id) ON DELETE CASCADE
);








-- Inserting data
INSERT INTO visas (country_code, country)
VALUES ('PL', 'Poland'),
       ('DE', 'Germany'),
       ('US', 'USA'),
       ('UK', 'United Kingdom'),
       ('CH', 'China'),
       ('FR', 'France');

INSERT INTO black_list (name, type)
VALUES ('John Marston', 1),
       ('Arthur Morgan', 1),
       ('Rick Grimes', 2),
       ('Vova Putler', 2);

INSERT INTO passengers (name, is_passport)
VALUES ('Carl Jung', 1),
       ('Ted Floyd', 1),
       ('Emmanuel Kline', 0),
       ('Kathie Hodges', 1),
       ('Winston Larsen', 1),
       ('John Marston', 1);

INSERT INTO terminals (id, flights_type)
VALUES ('A', 1), ('B', 2);

INSERT INTO planes (seats_count, allowed_luggage_weight, allowed_luggage_volume)
VALUES (88, 100, 30), (120, 130, 40), (60, 80, 25), (100, 90, 30);

INSERT INTO flights (type, destination_country_code, destination_city, frequency, profitability, passengers_count, departure_date, arrival_date, plane_id, terminal_id)
VALUES (1, null, 'Odesa', 2, 70, 1, '2024-06-26 14:30:00', '2024-06-26 16:30:00', 2, 'A'),
       (2, 'DE', 'Berlin', 1, 43, 0, '2024-06-13 09:15:00', '2024-06-13 12:30:00', 1, 'B'),
       (2, 'DE', 'Berlin', 1, 50, 2, '2024-06-13 23:15:00', '2024-06-14 02:30:00', 4, 'B'),
       (1, null, 'Lviv', 3, 30, 1, '2024-06-22 18:45:00', '2024-06-22 20:00:00', 3, 'B');

INSERT INTO passengers_on_board (passenger_id, flight_id, is_registration_success, visa_id)
VALUES (1, 1, 1, null),
       (2, 3, 1, 2),
       (5, 3, 1, 2),
       (3, 1, 0, null),
       (4, 4, 1, null);

INSERT INTO luggage (passenger_on_board__id, weight, volume)
VALUES (1, 90, 29);

