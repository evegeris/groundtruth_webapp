# Web app based on rdash-angular example
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/rdash/rdash-angular?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Folder structure:

### Full Installation Instructions (Ubuntu 14.04)
1. Install git
* sudo apt-get update
* sudo apt-get install git
2. Clone Repository
* git clone https://github.com/evegeris/groundtruth_webapp.git
3. Get pip
* sudo apt-get install python-pip
4. Get nodejs
* sudo apt-get install nodejs
5. Get npm
* sudo apt-get install npm
6. Get python developer
* sudo apt-get install python-dev
* sudo apt-get install libpq-dev python-dev
7. Get Flask
* sudo apt-get install Flask
8. Get bower
* sudo npm install -g bower
9. Get mysql-server
* sudo apt-get update
* sudo apt-get install mysql-server
* sudo mysql_secure_installation
* sudo mysql_install_db
10. Set up a blank db in mysql titled 'groundtruth_db'
* mysql -u root -p
* CREAT DATABASE groundtruth_db;
11. Delete 'migrations' folder if present
12. Install additional pip requirements
* sudo pip install -r requirements.txt 
13. Initialize Database
* python db.py db init 
* python db.py db migrate 
* python db.py db upgrade 
14. Run the program
* python run.py


### client
* original RDash front-end
* build and run development server by entering this directory and doing
* $ gulp build && gulp
* [Live example](http://rdash.github.io/) of the original RDash dashboard.

### app
* Python Flask used to serve static content (html, css, etc.)
* Front-end + back-end
* from the root directory, do
* $ pip install -r requirements.txt
* $ python db.py db init
* $ python db.py db migrate
* $ python db.py db upgrade
* $ python run.py
* More details [here](https://github.com/Leo-G/Flask-Scaffold) (this example also uses Protractor)


## Usage
### Requirements
* [NodeJS](http://nodejs.org/) (with [NPM](https://www.npmjs.org/))
* [Bower](http://bower.io)
* [Gulp](http://gulpjs.com)?

### Installation
1. Clone the repository: `git clone https://github.com/evegeris/groundtruth_webapp.git`
2. Install the NodeJS dependencies: `npm install`.
3. Install the Bower dependencies: `bower install`.
4. Run the gulp build task: `gulp build`.
5. Run the gulp default task: `gulp`. This will build any changes made automatically, and also run a live reload server on [http://localhost:8888](http://localhost:8888).

### Development
Continue developing the dashboard further by editing the `src` directory. With the `gulp` command, any file changes made will automatically be compiled into the specific location within the `dist` directory.

### New Features
1. Custom Draw Each Point on a Grid
2. An automation example for drawing a polygon (triangle)
3. An example of how to read in a JSON file 
4. An automation method that will draw ANY polygon from a JSON file


#### Modules & Packages
TO add additional modules/packages not included with rdash-angular, add them to `bower.json` and then update `index.html`, to include them in the minified distribution output.

## rdash-angular credits
* [Elliot Hesp](https://github.com/Ehesp)
* [Leonel Samayoa](https://github.com/lsamayoa)
* [Mathew Goldsborough](https://github.com/mgoldsborough)
* [Ricardo Pascua Jr](https://github.com/rdpascua)
