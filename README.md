# Web app for groundtruthing ML datasets
#### based on the rdash-angular example:
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/rdash/rdash-angular?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

### New Features
1. Added many layers of security (SQL Injection, XSS, CSRF)
2. Multithreaded server (should be good for ~100 hosts)
3. Easy Installer for Ubuntu 14.04+  and SQL Database Reset shell script
4. File Uploaded (upload an image for a quick demo)
5. File Downloads!

### Next Features To Add
1. Automatic Server Maintenance
2. Enable PNG files for input
3. 40x Error Screens

### Introduction

We are not web-developers but rather want to help provide this research tool to the academic community. Please feel free to add suggestions and contribute!

The objective of the webapp is to enable the rapid labeling of a database that will be eventually used by a machine learning algorithm. As we are still in the developmental phase, the web-application current runs as a local host and is geared towards labelling medical tissue data. We have plans to generalize the labelling tool such that you can specify within the application how you would like to label your data. The objective is to one day run the polished application on an external server to allow academics free access to a labelling tool, as well as open source access to the project if they wish to host their own flavour of a labelling tool!

The application aims to ease the labelling of data by utilizing the superpixel segmentation algorithm which can divide an image into coherant chunks that provide a compressed method of storing labelled data. My oversegmenting the image, a severely reduced image complexity with near-complete results (little information loss) helps enable rapid image labelling. 

Below are a few screenshots of the application. 

![Alt text](/readme_images/login.png?raw=true "Login Screen")

![Alt text](/readme_images/dashboard.png?raw=true "Central Dashboard")

![Alt text](/readme_images/crop.png?raw=true "Image Cropping Tool")

![Alt text](/readme_images/segmented.png?raw=true "Image Processed with the Superpixel Algorithm")

![Alt text](/readme_images/label.png?raw=true "Labeling the Segmented Image")


We are doing our best to convert this research project into something more user friendly, such that it can be used out of the box with very little programming. Currently our application is only supported on Ubuntu 14.04+ machines.


### Installation Method 1: Easy-Installation (Ubuntu 14.04+)
A bash script ('installer/installer-ubuntu14+.sh') has been developed which runs through most of the instructions provided below. There are many python dependancies, needs for an SQL server, some angularJS dependancies, and the Flask Framework. We highly recommend that you read through the installer script carefully as there may be conflicting dependancies with your current system. 

As well, we use the assumption that you do not currently have mysql in your machine. If this is not the case, please remove the commands from line 23 - line 99. You may then manually enter the mysql database commands located in the 'installer/cmds.txt' file and remove line 147, or alternatively you can switch your password into the mysql login command on line 147 of the installer. 

Note: For simplicity, mysql is set up with a username of 'root' and a password of 'gt_db_pass'. If you already have mysql and wish to use your current login credentials, you also need to edit line 13 and line 14 in 'config.py'. This file allows the application to access the back-end mysql database. 

One final comment is that the application creates several file directories that is in the same root directory that holds the pulled github repository. We chose to keep these directories out of the main repository to seperate user data with applications functionaility. When pulling this repository, keep in mind this current restriction. 

With that out of the way, the following steps to install the webapp are as follows:

* 1. Pull the github repository into a rootfolder that will also house the user-specific input and output files for the application.
* 2. Read carefully through the 'installer-ubuntu1404.sh' script so you don't ruin your machines environment.
* 3. Give the installer bash script execution privilages.
* 4. Run the scipt as as super user: $sudo ./installer-ubuntu1404.sh
* 5. Find any failed dependancies by re-running script and fix problems, or examine the Step by Step Dependancy Installation below

This script is reliant upon the 'cmds.txt' file which sets up the mysql database accordingly. If everything installed correctly, you should now be in the groundtruth_webapp directory. If so, you need to now run the application and create a user account.

* 6. Host the local server: $python run.py
* 7. Go to http://0.0.0.0:8888/ in Firefox
* 8. Select 'Sign Up' and create generic credentials

If everything was successful, your credentials will now be in the mysql database as a user. The final steps are to now add some images that you would like to label! Find the full filepath on your machine to the 'wound_images' folder that should be in the same root directory as the application repository. Place your images that you wish to segment in this folder as we will be linking the file paths to your user account.

* 9. login to mysql server: $mysql -u root -pgt_db_pass
* 10. Select the Database: mysql>USE groundtruth_db;
* 11. Insert the filepath: mysql>INSERT INTO images (relative_orig_filepath) VALUES ('wound_images/myimage.jpg');
* 12. Associate the image with your user account: mysql>INSERT INTO user_has_image (users_id, images_id, progress) VALUES (1, 1, 0);

See Method 2 for more details on these two SQL commands.

When you run the local server and login in, you will be able to see your image within the application on the 'Continue' screen. As the application runs, server-client interactions will begin to populate the 'json' and 'segmented' directories. 

If something went wrong during this process, refer to the Step by Step Dependancy Installation.


### Installation Method 2: Step by Step Dependancy Installation (Ubuntu 14.04+)

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
* mysql> USE groundtruth_db;
* (example insert statements)
* mysql>INSERT INTO images (relative_orig_filepath) VALUES ('directory/imageName.jpg');
* mysql>INSERT INTO images (relative_orig_filepath) VALUES ('wound_images/myimage.jpg');
* mysql>INSERT INTO images (relative_orig_filepath) VALUES ('wound_images/otherimage.jpg');
* mysql>INSERT INTO user_has_image (users_id, images_id, progress) VALUES (userID, ImageNumber, completed);
* mysql>INSERT INTO user_has_image (users_id, images_id, progress) VALUES (1, 1, 0);
* mysql>INSERT INTO user_has_image (users_id, images_id, progress) VALUES (1, 2, 0);

### Simple Use Mode:
Instead of playing around with the SQL database to upload images, simply upload a file to the server for labelling on the cropping screen of the application! Note: currently only .jpg and .jpeg are supported, however .png compatability will be coming soon! 

When you are done labelling the file, a handy .zip file will be downloaded to the local machine that includes:
1. The cropped image
2. The image with segment overlay (for reference)
3. A .json file which describes the original integer mask for the segmented image
4. A .json file which acts as a dictionary relating the labelled superpixels to the corresponding label.

Note: the first array in the dictionary is always set to 0. That is, the first label starts at the second array within the .json dictionary. 

### New Feature -- File Upload, Zip Download, and DB Cleaner

1. You can now upload files and test out the application without playing with the SQL database every time. The SQL database needs to be initialized at the start however. These files are stored locally on the server after being uploaded.

2. When you finish labelling the image, a Zip file is sent your way with everything you need. How handy!

3. Keep messing up the SQL databse and want to reset it? Run the database_cleaner.sh script to wipe the SQL database for a fresh start! (You will need to create a new account on the server and insert some images first into the database however to use the application)

### Development
Want to contribute?

All of the easy to modify code is in the 'app/' directory. 
HTML Files: app/templates/
Javascript Files: app/templates/static/js/ctrl/


#### Modules & Packages
TO add additional modules/packages not included with rdash-angular, add them to `bower.json` and then update `index.html`, to include them in the minified distribution output.

## rdash-angular credits
* [Elliot Hesp](https://github.com/Ehesp)
* [Leonel Samayoa](https://github.com/lsamayoa)
* [Mathew Goldsborough](https://github.com/mgoldsborough)
* [Ricardo Pascua Jr](https://github.com/rdpascua)
