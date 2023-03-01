### Exam project to test Performance in Mysql vs MongoDB

Project for testing the performance on MySQL and MongoDB. <br>
Tests that is done is SELECT and INSERT of 10k, 100k, 200k, 500k and 1 million records to see the different in ms. <br>


Add your own .env file with the structure: <br>
PASSWORD="your password" <br>
USER="user for mysql" <br>
HOST="host for mysql" <br>
MYSQL_DATABASE="your mysql database name" <br>
MONGODB_DATABASE="your mongodb database name" <br>
MYSQL_TABLE="your msql table name" <br>
MONGODB_COLLECTION="your mongodb collection name" <br>
MYSQL_INSERT_TABLE="name of your msql insert table" <br>
MONGODB_INSERT_COLLECTION="name of your insert collection"
FILE_PATH="raw-data/sudoku-1m.txt" (Put the large datafile in a directory named raw-data) <br>

Select is done with Limit <br>
Inserts is done with limit <br>
