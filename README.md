this-day
=============
This nodejs project will query wikipedia's pages and scrape information for what happened on this day in history and then export the data to a csv (for easy importing to a database);

Setup
-------------------
Ensure node and npm are installed then:
	npm install
	node process.js



Importing to Postgress
-------------------
To import to postgres use the following command from the psql prompt

COPY events(year,month_day,type,html) FROM '{{path}}/this-day/events_in_history.csv' DELIMITER ',' CSV;