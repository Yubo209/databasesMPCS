# .env
The 2 datasource is at datasource folder
Each has the relationship with the entities created,
and my .env include MYSQL_HOST=localhost
                    MYSQL_PORT=3306
                    MYSQL_USER=root
                    MYSQL_PASSWORD=myPassword
                    MYSQL_DB=sakila
                    SQLITE_PATH=analytics.db    
# Run Commands:

npm run cli -- init

npm run cli -- full

npm run cli -- sync

npm run cli -- validate

# Schema Diagram
See diagram below:

Dimension tables:
- dim_date
- dim_film
- dim_actor
- dim_category
- dim_store
- dim_customer

Fact tables:
- fact_rental
- fact_payment

Bridge tables:
- bridge_film_actor
- bridge_film_category
