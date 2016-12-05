# Project Sharit
Sharit Website

*Updated 12/4/2016*

http://ec2-52-91-21-93.compute-1.amazonaws.com:3000/

## Overview
Sharit is a website developed to share information between users of established organizations. Main features supported are file sharing with threads, comments for users to communicate with one another. This website is built on NodeJS for front and back end, postgreSQL for db, and React.js + bootstrapping for frontend responsiveness.

## Technologies Involved
* NodeJS
* PostgreSQL
* HTML5
* CSS3

## Usage
User will sign in (sign up if haven't done so), look for a thread, and comment on a thread. Users could also create a thread and upvote or downvote other user's comments. 
Files will be shared through threads.

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
Verify sharit database has been created (if anything goes wrong, can do "DROP DATABASE sharit;" on psql cli:
```javascript
sudo -u postgres psql
\l \\ show databases under user "postgres"
\q
```
Restore sharit.backup database into initial empty sharit we created earlier (watch for path):
```javascript
sudo pg_restore --host 'localhost' --port 5432 --username "postgres" --dbname "sharit" --clean "/home/ubuntu/GitHub/Sharit/databaseFiles/sharit.backup"
```
The PostgreSQL should be running, but if it is not or unexpectedly dies, PostgreSQL service can be restarted:
```javascript
sudo service postgresql restart
```

### Running NodeJS and PM2
Browse to /Sharit/src and get all npm dependencies:
```javascript
sudo npm install
```
Run the server directly by the following command:
```javascript
node bin/www
```
The server can be automatically restarted upon crash with a production manager module, pm2. Install pm2 by:
```javascript
sudo npm install pm2 -g
```
And run with:
```javascript
pm2 start ./bin/www
```
To kill process:
```javascript
pm2 stop www
```
To delete process from PM2:
```javascript
pm2 delete www
```

### Using PostgreSQL on CLI
```javascript
sudo -u postgres psql
\l \\ show databases
\q \\ quit
\c 'database_name' \\ use this database
'SQL'; \\ perform the SQL.
SELECT * FROM users.user; \\ show members id, pass(hashed), etc.
```

### Git Protocols:
To replace all your local files (including edits) with remote repo:
```git
git fetch origin
git reset --hard origin/master
git clean -f -d
```
To get the latest code updates:
```git
git pull
```
To push all your local files (if merge conflict commit first then pull and push):
```git
git add .
git commit -a
git push origin master
```
To replace all the remote files using your local files:
```git
git push -f origin master
```
