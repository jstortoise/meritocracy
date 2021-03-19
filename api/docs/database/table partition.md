# MySQL Table Partitioning

We used table partitioning on our project to optimize search on our website.

To see table partitioned databse, please check `users` table on [db.sql] ()

## 1. Partitioning method

We used vertical partitioning.

### What is vertical partitioning?

Vertical partitioning involves creating tables with fewer columns and using additional tables to store the remaining columns. Normalization also involves this splitting of columns across tables, but vertical partitioning goes beyond that and partitions columns even when already normalized.

For more details please refer to [here](http://acmeextension.com/mysql-table-partitioning/)

## 2. Benefits of partitioning

A popular and favorable application of partitioning is in a distributed database management system. The main purpose of partitioning is maintainability and performance. Our query performance will be much better as compared to the non-partitioned table.

## 3. Partition criteria

We used Range partitioning by `username` field on `users` table to improve search speed by username in login and search.

### What is Range partitioning?

For more details please refer to [here](http://acmeextension.com/mysql-table-partitioning/)

## 4. Test

After table partitioning, we compared test result between non-partitioned table and partitioned table.

| Table type      | Records count | Query time |
| :-------------- | :------------ | :--------- |
| Non-Partitioned | 10,000        | 1.452s     |
| Partitioned     | 10,000        | 0.004s     |


## 5. Reference

For better understanding of MySQL table partitioning, please refer to the below documentations.

- https://dev.mysql.com/doc/refman/5.7/en/partitioning.html
- http://acmeextension.com/mysql-table-partitioning/
- http://download.nust.na/pub6/mysql/tech-resources/articles/performance-partitioning.html