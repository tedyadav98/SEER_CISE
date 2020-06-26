# Code for Article Database
This project contains the code for the article database.
## Use
The article database is a database used to manage and store software engineering articles for users to browse, submitters to upload articles, moderators to maintain standards, and admins to manage the website.
## Steps to Start Application
* Open the github repository in vscode or IDE of choice
* Head to the terminal
* Type "nodemon start"
* Go to the localhost in the web browser
* By typing http://localhost:3000/article
## Steps to set up mongodb compass
* Download mongodb compass comunity version
* Have a connection made to the localhost instead of the web server.
* Create a new database with the name 'ArticleDB'
* Create a new table named 'articles' in 'ArticleDB'
## MVC Architecture
* All of the code follows the MVC format.
* Package.json contains the configuration files and dependencies for the project.
* Model includes the database schema files and database connection.
* Controller has one main file articleController.js that handles input from the form and manipulates it for adding articles to database and advanced search/querying from the database.
* View folder contains all the html files to be displayed.
## Built and Tested with
* Node.js
* JSON
* NPM
* MongoDB
* TravisCI
* Heroku
## Authors and Acknowledgement
* Ted Yadav
* Adrian Fehr
* Hans Sidharta
* Jason Martelletti
