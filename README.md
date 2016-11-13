# Project Sharit
Sharit Website

## Overview
Sharit is a website developed to share information between users of established organizations. Main features supported are file sharing with threads, comments for users to communicate with one another. This website is built on NodeJS for front and back end, postgreSQL for db, and React.js + bootstrapping for frontend responsiveness.

## Technologies Involved
* NodeJS
* React
* PostgreSQL
* HTML5
* CSS3

## Usuage
User will sign in (sign up if haven't done so), look for a thread, and comment on a thread. Users could also create a thread and upvote or downvote other user's comments.

## How to Install and Run
### Installing NodeJS
On Ubuntu 16.04 LTS, download NodeJS and npm. Commands to do so:
```javascript
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
```
To update node:
```javascript
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
sudo n latest
```

### Installing and Running PostgreSQL
Download PostgreSQL with the following commands:
```javascript
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```
Change user "postgres" password to "root"
```javascript
sudo -u postgres psql
\password postgres \\ confirm "root"
\q
```
Create initial empty sharit database:
```javascript
sudo psql -h 'localhost' -p 5432 -U postgres -c "CREATE DATABASE sharit"
```
Verify sharit database has been created:
```javascript
sudo -u postgres psql
\l \\ show databases under user "postgres"
\q
```
Restore sharit.backup database into initial empty sharit we created earlier (watch for path):
```javascript
sudo pg_restore --host 'localhost' --port 5432 --username "postgres" --dbname "Sharit" --clean "/home/ubuntu/GitHub/Sharit/sharit.backup"
```
The PostgreSQL should be running, but if it is not or unexpectedly dies, PostgreSQL service can be restarted:
```javascript
sudo service postgresql restart
```

### Running NodeJS
Browse to /Sharit/src and type the following command:
```javascript
node app.js
```
The server can be automatically restarted upon crash with a production manager module, pm2. Install pm2 by:
```javascript
sudo npm install pm2 -g
```
And run with:
```javascript
pm2 start app.js
```
