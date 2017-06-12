# Web app for ground-truthing ML datasets


### New Features (Alpha -- V 3.0)
1. Upload & delete images from the client side
2. Interactive user feedback
2. Guest login & tutorials
3. Improved output files (.zip)
7. Easy Installer for Ubuntu 14.04+  and SQL Database reset shell script

### Introduction

The steady increase in computation power alongside with the decreasing cost of GPUs has enabled the rapid integration of machine learning (ML) applications into daily life. Although the greatest challenge with bringing these ML applications to fruition is the development of the algorithm's model, another underlying issue is getting the necessary data to train that model (assuming **supervised learning** applications). In particular, **pixel level** labeling for images still poses a great challenge due to the resources needed to produce a complete 

With this challenge in mind several students from the **University of Guelph**, along with support from UofG's machine learning research group and industry contacts, have tackled the challenge of labeling image data at the pixel level. With the intention of producing an application that can be available for easy use by Academia, a web-application has been decided upon. 

With a large focus on ease-of-use by the end-user, as well as ensuring near-completeness in the labeling process, the aid of the **SLIC Superpixel Algorithm** has been selected due to its small performance overhead in conjunction with its adequate segmentation process, allowing for the server to be hosted in a PC.  By over segmenting the image with the SLIC algorithm, a severely reduced image complexity with near-complete results (little information loss) helps enable rapid image labeling.

This application is now in its **Alpha testing phase**; complete end-to-end, client-side functionality is in working order. The application is not permanently hosted but is available on weekends in requested. The application has currently been produced to run on a development server which lacks large-scale scalability in its current phase, but can support approximately ~100 simultaneous connections. 



Below are a few screen shots of the web-application. Some examples of the different application uses can be seen throughout.

![Alt text](/readme_images/login.png?raw=true "Login Screen")

![Alt text](/readme_images/dashboard.png?raw=true "Central Dashboard")

![Alt text](/readme_images/tutorial.png?raw=true "User Tutorials")

![Alt text](/readme_images/profile.png?raw=true "Profile Settings")

![Alt text](/readme_images/crop.png?raw=true "Image Cropping Tool")

![Alt text](/readme_images/segmented.png?raw=true "Image Processed with the Superpixel Algorithm")

![Alt text](/readme_images/labelled1.png?raw=true "Labeling the Segmented Image")

![Alt text](/readme_images/labelled2.png?raw=true "Labeling the Segmented Image")

![Alt text](/readme_images/labelled3.png?raw=true "Labeling the Segmented Image")

As mentioned, the web-application is not currently public available for access, but can be downloaded for local hosting purposes on a private network. Instructions for the downloading and installation of the application are found below. 

**Note:** it is recommended that this application be run either in a virtual environment or with **DEBUG** mode set to **False**. Furthermore there should be careful monitoring of connections as there may be vulnerabilities that could result in loss of user-information within the MySQL back-end. Common security measures have been followed and at worst, a DDOS will take down the server.

### Installation Method 1: Easy-Installation (Ubuntu 14.04+)
A bash script ('installer/installer-ubuntu14+.sh') has been developed which runs through most of the instructions provided below. There are many python dependencies, needs for an SQL server, some angularJS dependencies, and the Flask Framework. We highly recommend that you read through the installer script carefully as there may be conflicting dependencies with your current system. 

As well, we use the assumption that you do not currently have mysql in your machine. If this is not the case, please remove the commands from line 23 - line 99. You may then manually enter the mysql database commands located in the 'installer/cmds.txt' file and remove line 147, or alternatively you can input your password into the MySql login command on line 147 of the installer script. 

**Note:** For simplicity, MySql is set up with a username of 'root' and a password of 'gt_db_pass'. If you already have MySql and wish to use your current login credentials, you also need to edit line 13 and line 14 in 'config.py'. This file allows the application to access the back-end MySql database. **We highly recommend changing the username and password.**

One final comment is that the application creates on directory that is in the same root directory that holds the pulled github repository. We chose to keep this directory out of the main repository to separate user data with applications functionality. When pulling this repository, keep in mind this current restriction. 

With that out of the way, the following steps to install the webapp are as follows:

* 1. Pull the github repository into a rootfolder that will also house the user-specific input and output files for the application.
* 2. Read carefully through the 'installer-ubuntu1404.sh' script so you don't ruin your machines environment.
* 3. Give the installer bash script execution privilages.
* 4. Run the scipt as as super user: $sudo ./installer-ubuntu1404.sh
* 5. Find any failed dependancies by re-running script and fix problems, or examine the *Step by Step Dependancy Installation* below.

This script is reliant upon the 'cmds.txt' file which sets up the MySql database accordingly. If everything installed correctly, you should now be in the groundtruth_webapp directory. Now the server can be hosted:

* 6. Host the local server: $python run.py
* 7. Go to http://0.0.0.0:8888/ in Firefox or Chrome.
* 8. Select 'Sign Up' and create the guest credentials:
* 9. **Name:** 'Guest'; **Email:** 'guest@guest.com' **Password:** 'guestpw'

If everything was successful, the guest-credentials have been added to the MySql database and you should be able to login with the 'Guest Access' button on the login screen, gaining limited access to the application. For full access, sign-up using any other email. **Note:** These emails are used for back-end login and profile tracking purposes. It is recommended that the emails be kept generic at this time.


### Installation Method 2: Step by Step Dependancy Installation (Ubuntu 14.04+)

1. Install git
* $apt-get update
* $apt-get install git
2. Clone Repository
* $git clone https://github.com/evegeris/groundtruth_webapp.git
3. Get pip
* $apt-get install python-pip
4. Get nodejs
* $apt-get install nodejs
5. Get npm
* $apt-get install npm
6. Get python developer
* $apt-get install python-dev
* $apt-get install libpq-dev python-dev
7. Get Flask
* $apt-get install Flask
8. Get bower
* $npm install -g bower
9. Get mysql-server (password should match that in config.py)
* $apt-get update
* $apt-get install mysql-server
* $mysql_secure_installation
* $mysql_install_db
10. Set up the 'groundtruth_db' database (installer directory)
* $./database_cleaner.sh
11. Install additional pip requirements
* $pip install -r requirements.txt
12. Run the program
* $python run.py
13. Access the client side
* http://0.0.0.0:8080
14. Create the guest account on the login page
* **Name:** 'Guest'; **Email:** 'guest@guest.com' **Password:** 'guestpw'
15. Create a full account with anyother email address
* **Name:** 'User'; **Email:** 'user@email.com' **Password:** 'userpw'

### Whats does the Web-Application Provide?
After you have uploaded an image to label and completed the labelling process, a .zip file is sent to the client's browser that should include all of the necessary files for training a supervised ML model. The files include:
1. The cropped image
2. The image with segment overlay (for reference only)
3. A .json file which holds the original unlabeled integer mask for the cropped image
4. A .json file which acts as a dictionary relating the labeled superpixels to the corresponding label (compressed storage).
5. A .json file which is the labeled integer mask for the cropped image (uncompressed storage)

### New Feature -- Comments

1. If a guest account is created on the SQL database, then a user can login without needing to create their own credentials. This guest mode has limited access to the site.
2. Tutorials are provided for both full-access mode and guest-mode
3. The labeled integer mask is now included in the .zip file and was reconstructed from the dictionary.
4. The server will now clean the clutter of temporary files every night at midnight, or when the folders get too large. Be warned, the file cleaning can erase some temporary, in-use data for labeling!
5. All file uploading and deletion can be managed from the client-side.
6. Keep messing up the MySql database and want to reset it? Run the database_cleaner.sh script to wipe the MySql database for a fresh start! (You will need to create a new account on the server, including the Guest-Account)

### Development
Want to contribute? Suggestions? 

Open a github comment thread or email me at: mmccar04@mail.uoguelph.ca! I would love some support with this tool!


#### Modules & Packages
TO add additional modules/packages not included with rdash-angular, add them to `bower.json` and then update `index.html`, to include them in the minified distribution output.



## rdash-angular credits
* [Elliot Hesp](https://github.com/Ehesp)
* [Leonel Samayoa](https://github.com/lsamayoa)
* [Mathew Goldsborough](https://github.com/mgoldsborough)
* [Ricardo Pascua Jr](https://github.com/rdpascua)
#### based on the rdash-angular example:
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/rdash/rdash-angular?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
