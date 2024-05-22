USE cursova_db;

SHOW TABLES;

# Отримаємо загальну кількість рейсів з кожного терміналу згрупованих по терміналу
SELECT terminals.id,
       COUNT(*) AS flight_count
FROM terminals
INNER JOIN flights ON terminals.id = flights.terminal_id
GROUP BY terminals.id;


# Отримаємо список рейсів з кожного терміналу згруповані по терміналу та країні, а також допишимо flights_type
SELECT terminals.id,
       COUNT(*) AS flights_count,
       IF (visas.country IS NULL, 'Ukraine', visas.country) AS country,
       CASE
           WHEN terminals.flights_type = 1 THEN 'local'
           WHEN terminals.flights_type = 2 THEN 'international'
       END AS flights_type
FROM terminals
INNER JOIN flights ON terminals.id = flights.terminal_id
LEFT JOIN visas ON visas.country_code = flights.destination_country_code
GROUP BY terminals.id, country, flights_type;




# Список днів в яких є доступні рейси, їхня кількість та сума пасажирів (відсортовано від найбільш завантажених днів)
SELECT DATE(departure_date) AS DATE,
       COUNT(*) AS total,
       SUM(passengers_count) AS total_passengers
FROM flights
GROUP BY DATE
ORDER BY total DESC;


# Список id доступних рейсів відповідно до їхньої країни призначення, та місто прибуття
SELECT flights.id AS flight_id,
       IF (visas.country IS NULL, 'Ukraine', visas.country) AS country,
       destination_city
FROM visas
RIGHT JOIN flights ON visas.country_code = flights.destination_country_code;


# Для подальшої зручної взаємодії створимо view зі списком всіх "пасажирів на борту", включаючи їхні дані, деталі про багаж, а також деталі про їхній рейс
CREATE OR REPLACE VIEW full_passengers_info AS
SELECT passengers_on_board.id AS id,
       name,
       created_at AS passenger_created_at,
       is_registration_success,
       visa_id,
       luggage.id AS luggage_id,
       weight,
       volume,
       flight_id,
       IF (country IS NULL, 'Ukraine', country) AS destination_country,
       destination_city,
       departure_date,
       arrival_date,
       terminal_id,
       plane_id
FROM passengers_on_board
INNER JOIN passengers ON passengers_on_board.passenger_id = passengers.id
LEFT JOIN luggage ON passengers_on_board.id = luggage.passenger_on_board__id
INNER JOIN flights ON passengers_on_board.flight_id = flights.id
LEFT JOIN visas ON visas.country_code = flights.destination_country_code;

# викличемо наш створений view
SELECT * FROM full_passengers_info;


# (виходячи зі створеного view з назвою full_passengers_info) Список усіх НЕ успішно зареєстрованих пасажирів з деталями про них
SELECT * FROM full_passengers_info
WHERE is_registration_success = 0;



# Список пасажирів на борту відповідно до їхнього рейсу
# SELECT passengers_on_board.id, passenger_id, flight_id, is_registration_success, visa_id, flights.id, type, destination_country_code, destination_city, frequency, profitability, passengers_count, departure_date, arrival_date, plane_id, terminal_id
# FROM passengers_on_board
# RIGHT JOIN flights ON passengers_on_board.flight_id = flights.id;


# Список пасажирів які знаходяться в розшуку
SELECT passengers.id,
       black_list.name AS name,
       type,
       is_passport,
       created_at
FROM passengers
INNER JOIN black_list ON passengers.name = black_list.name;


# виводить список пасажирів чий багаж не проходить перевірку по дозволеним парамертам багажу на літаку, який буде використовуватися для рейсу
SELECT passengers_on_board.id,
       name,
       luggage.weight,
       allowed_luggage_weight,
       IF (luggage.weight > allowed_luggage_weight, 0, 1) AS isLuggageWeightAllowed,
       luggage.volume,
       allowed_luggage_volume,
       IF (luggage.volume > allowed_luggage_volume, 0, 1) AS isLuggageVolumeAllowed
FROM luggage
JOIN passengers_on_board ON luggage.passenger_on_board__id = passengers_on_board.id
JOIN passengers ON passengers_on_board.passenger_id = passengers.id
LEFT JOIN flights ON passengers_on_board.flight_id = flights.id
LEFT JOIN planes ON flights.plane_id = planes.id
WHERE luggage.weight > allowed_luggage_weight OR luggage.volume > allowed_luggage_volume;




# припустимо ми захотіли зробити рефакторинг таблиці visas:
# перейменуємо її на "countries_and_visas"
# додамо додаткову колонку "capitals",
# але потім зрозумівши, що це погана ідея - видалимо колонку, що додали та повернемо стару назву
ALTER TABLE visas RENAME countries_and_visas;
ALTER TABLE countries_and_visas
ADD COLUMN capitals VARCHAR(255);

ALTER TABLE countries_and_visas RENAME visas;
ALTER TABLE visas DROP COLUMN capitals;


# зробимо insert даних в таблицю passengers допустивши при цьому помилку в даних
# для того, щоб виправити її - зробимо update
INSERT INTO passengers (name, is_passport) VALUES ('mistake', 1);
SELECT * FROM passengers;
UPDATE passengers SET name = 'Denys Funderat' WHERE name = 'mistake';
SELECT * FROM passengers;
# DELETE FROM passengers WHERE name = 'Denys Funderat';

# зробимо insert даних в таблицю terminals, тобто додамо зайвий по умові термінал
# тож видалимо його
INSERT INTO terminals (id, flights_type) VALUES ('C', 1);
SELECT * FROM terminals;
DELETE FROM terminals WHERE id = 'C';