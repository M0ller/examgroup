### Exam project to test Performance in Mysql vs MongoDB

ExamProject for testing the query performance on MySQL and MongoDB in different pool sizes. <br>
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


### Computer specs: <br>
Computer 1: <br>
Processor: 11th Gen Intel(R) Corde(TM) <br>
i5-11300H @ 3.10 GHz 311 GHz <br>
RAM: 16GB <br>
GPU: NVIDIA GeForce RTX 3060 Laptop GPU <br>
Operativsystem: Windows 10 <br>

Computer 2: <br>
Processor: AMD Ryzen 5 3600 6-Core Processor 3.95 GHz <br>
RAM: 32.0 GB <br>
GPU: AMD Radeon RX 5700 XT <br>
Operativsystem: Windows 10 <br>


These test where performed in 4 separate executions. <br>
Each execution performed a test iteration towards MySQL and MongoDB separately. <br>
In each of these executions there was an operation type and then different size pools. Each test was performed in 10 itterations before moving on to the next test.  <br>
Example of one execution: After the first test on SELECT of 10K records had been performed in 10 iterations it moved on to the next test pool size of SELECT on 100K records with 10 itterations and then continued so until the 1M records was completed. This execution was done first in MySQL and then towards MongoDB. Afterwards the results where collected it was compared towards each other. <br>

### Performance Results: <br>
Following table displays how many times MySQL was faster in its query execution then MongoDB.<br>
| Computer | Operation Type | 10K | 100K | 200K | 500K | 1M | Total Execution |
|:--------:|:--------------:|:---:|:----:|:----:|:----:|:--:|:---------------:|
| Computer 1 | Select | 1.4 | 2.1 | 2.2 | 2.1 | 2.1 | 2.1 |
| Computer 1 | Insert | 7.7 | 6.8 | 5.6 | 9.3 | 16.6 | -26.1  |
| Computer 2 | Select | 2.9 | 3.2 | 3.3 | 3.3 | 3.1 | 3.2 |
| Computer 2 | Insert | 9.0 | 10.6 | 7.5 | 9.7 | 17.1 | -16.5  |



MySQL performed its query operation faster than MongoDB in both SELECT and INSERT procedure. <br>
Notable result from this is that the total execution time in the Insert tests shows that MySQL is slower.<br>
Speculating this is that in each iteration there is a create table/collection and drop table/collection. It seems that this is much more performance demanding procedure for MySQL then MongoDB.

[Individual Execution Results](queryTests.md)