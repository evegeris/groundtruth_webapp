# Web app for groundtruthing ML datasets
#### based on the rdash-angular example:
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/rdash/rdash-angular?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

We are not proper web developers so much of this app is cobbled together from various sources. Feel free to use and tweak it! 

### Full Installation Instructions (Ubuntu 14.04)
* 1. Install git
* $sudo apt-get update
* $sudo apt-get install git
* 2. Clone Repository
* $git clone https://github.com/evegeris/groundtruth_webapp.git
* 3. Get pip
* $sudo apt-get install python-pip
* 4. Get nodejs
* $sudo apt-get install nodejs
* 5. Get npm
* $sudo apt-get install npm
* 6. Get python developer
* $sudo apt-get install python-dev
* $sudo apt-get install libpq-dev python-dev
* 7. Get Flask
* $sudo apt-get install Flask
* 8. Get bower
* $sudo npm install -g bower
* 9. Get mysql-server (password should match that in config.py)
* $sudo apt-get update
* $sudo apt-get install mysql-server
* $sudo mysql_secure_installation
* $sudo mysql_install_db
* 10. Set up the 'groundtruth_db' database
* Install and open MySQL Workbench (eg. through the Ubuntu Software Centre)
* Open the db schema 'Database/groundtruth_db.mwb' within MySQL Workbench
* From the main toolbar select 'Database' -> 'Forward Engineer...'
* Follow the prompts to create the database
* 10.1. Prepare the database of images to be classified
* $python populate_database.py root/filepath/to/images
* 11. Install additional pip requirements
* $sudo pip install -r requirements.txt
* 12. Run the program
* $python run.py
* 13. Create a user for yourself through the login page
* 14. (Developer) Set up some sample image data
* $ mysql -u root -p
* mysql> use groundtruth_db;
* (example insert statements)
* mysql> insert into images (fullsize_orig_filepath) values ('wound_images/wound_2.jpg');
* mysql> insert into images (fullsize_orig_filepath) values ('wound_images/Pressure08.jpg');
* mysql> insert into user_has_image (users_id, images_id, progress) values (1, 1, 0);
* mysql> insert into user_has_image (users_id, images_id, progress) values (1, 1, 0);

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

### Etc.
* image filepaths in database assumed to be relative to the static/images folder

#### Modules & Packages
TO add additional modules/packages not included with rdash-angular, add them to `bower.json` and then update `index.html`, to include them in the minified distribution output.

## rdash-angular credits
* [Elliot Hesp](https://github.com/Ehesp)
* [Leonel Samayoa](https://github.com/lsamayoa)
* [Mathew Goldsborough](https://github.com/mgoldsborough)
* [Ricardo Pascua Jr](https://github.com/rdpascua)
