# Web app for ground-truthing ML datasets


### New Features (Alpha -- V 3.2)
1. Upload & delete images from the client side
2. Interactive user feedback
3. Guest login & tutorials
4. Improved output files (.zip)
5. Easy Installer for Ubuntu 14.04+  and SQL Database reset shell script
6. Decreased segmentation line width
### Introduction

The steady increase in computation power alongside with the decreasing cost of GPUs has enabled the rapid integration of machine learning (ML) applications into daily life. Although the greatest challenge with bringing these ML applications to fruition is the development of the algorithm's model, another underlying issue is getting the necessary data to train that model (assuming **supervised learning** applications). In particular, **pixel level** labeling for images still poses a great challenge due to the resources needed to produce a complete 

With this challenge in mind several students from the **University of Guelph**, along with support from UofG's machine learning research group and industry contacts, have tackled the challenge of labeling image data at the pixel level. With the intention of producing an application that can be available for easy use by Academia, a web-application has been decided upon. 

With a large focus on ease-of-use by the end-user, as well as ensuring near-completeness in the labeling process, the aid of the **SLIC Superpixel Algorithm** has been selected due to its small performance overhead in conjunction with its adequate segmentation process, allowing for the server to be hosted in a PC.  By over segmenting the image with the SLIC algorithm, a severely reduced image complexity with near-complete results (little information loss) helps enable rapid image labeling.

This application is now in its **Alpha testing phase**; complete end-to-end, client-side functionality is in working order. The application is not permanently hosted but is available on weekends in requested. The application has currently been produced to run on a development server which lacks large-scale scalability in its current phase, but can support approximately ~100 simultaneous connections. 



Below are a few screen shots of the web-application. Some examples of the different application uses can be seen throughout.
#### Login Screen:
![Alt text](/readme_images/login.png?raw=true "Login Screen")
Secure storage of user's information in the MySql backend.
&nbsp;
#### Central Application Dashboard:
![Alt text](/readme_images/dashboard.png?raw=true "Central Dashboard")
Provides means to upload images for labeling.
&nbsp;
#### User Tutorial:
![Alt text](/readme_images/tutorial.png?raw=true "User Tutorials")
A quick run through of the application work flow.
&nbsp;
#### Profile Settings:
![Alt text](/readme_images/profile.png?raw=true "Profile Settings")
Can select the number of labels, names, and colors.
&nbsp;
#### Cropping Screen:
![Alt text](/readme_images/crop.png?raw=true "Image Cropping Tool")
Can focus in on the area of interest for labeling.
&nbsp;
#### Superpixel Granularity:
![Alt text](/readme_images/segment.png?raw=true "Image Processed with the Superpixel Algorithm")
Can vary the granularity of the segmentation algorithm.
&nbsp;
#### Labelling Screen:
![Alt text](/readme_images/labelled1.png?raw=true "Labeling the Segmented Image")

![Alt text](/readme_images/labelled2.png?raw=true "Labeling the Segmented Image")

![Alt text](/readme_images/labelled3.png?raw=true "Labeling the Segmented Image")
Can be used for labeling different images.

As mentioned, the web-application is not currently public available for access, but can be downloaded for local hosting purposes on a private network. Instructions for the downloading and installation of the application are found below. 

**Note:** it is recommended that this application be run either in a virtual environment or with **DEBUG** mode set to **False**. Furthermore there should be careful monitoring of connections as there may be vulnerabilities that could result in loss of user-information within the MySQL back-end. Common security measures have been followed and at worst, a DDOS will take down the server.

### Installation Method 1: Easy-Installation (Ubuntu 14.04+)

**Prerequisites:**
* OpenCV: python-opencv
* MySql Server: apt-get install mysql-server
* non-root user for MySql

A bash script ('installer/installer-ubuntu14+.sh') runs through most of the instructions provided below. There are many python dependencies, needs for an MySql server, some angularJS dependencies, and the Flask Framework. Please read through the dpendencies in the ('installer/installer-ubuntu14+.sh') prior to installation. 

Note that one directory is created inside of the root directory in which the GitHub repository is located. This directory contains all of the user files for the application. As well, the shell script is reliant upon the 'cmds.txt' file which sets up the MySql database accordingly.

Installation steps:

1. Pull the github repository into a rootfolder that will also house the user-specific input and output files for the application.
2. Read carefully through the 'installer-ubuntu14+.sh'.
3. Give the installer bash script execution privilages. **Example:**
* chmod +x installer-ubuntu14+.sh
4. Run the scipt as as super user: $sudo ./installer-ubuntu14+.sh
5. Fix any of the failed dependancies: *Step by Step Dependancy Installation* below.
6. Give the non-root user access to the 'groundtruth_db' database. **Example**:
* CREATE USER 'gtapp'@'localhost' IDENTIFIED BY '(insert password)';
* grant all privileges on groundtruth_db.* to 'gtapp'@'localhost';
* flush privileges;
7. Modify the file 'config.py' to use the non-root user
* mysql_db_username = '(insert username)'
* mysql_db_password = '(insert password)'
8. Modify the file 'config.py' with a new 32-character Secret Key
* SECRET_KEY = "(insert secret key)"
9. Host the local server: $python run.py
10. Go to http://0.0.0.0:8888/ in Firefox or Chrome.
11. Select 'Sign Up' and create the guest credentials:
12. **Name:** 'Guest'; **Email:** 'guest@guest.com' **Password:** 'guestpw'
13. Insert a test image into 'GT_USER/USER_1/images/' called 'wound.jpg'.

If everything was successful, the guest-credentials have been added to the MySql database and you should be able to login with the 'Guest Access' button on the login screen, gaining limited access to the application. For full access, sign-up using any other email. **Note:** These emails are used for back-end login and profile tracking purposes. It is recommended that the emails be kept generic at this time. **Example:** madison@mail.com or user2@mail.com.


### Installation Method 2: Step by Step Dependancy Installation (Ubuntu 14.04+)

**Prerequisites:**
* OpenCV: python-opencv
* MySql Server: apt-get install mysql-server
* non-root user for MySql

Follow these step-by-step instructions to install the application if the first method fails.

1. Install git
* apt-get update
* apt-get install git
2. Clone Repository
* git clone https://github.com/evegeris/groundtruth_webapp.git
3. Get pip
* apt-get install python-pip
4. Get nodejs
* apt-get install nodejs
5. Get npm
* apt-get install npm
6. Get python dependancies
* apt-get install python-setuptools
* apt-get install python-dev build-essential
* apt-get install libpq-dev python-dev
* apt-get install python-tk
* apt-get install python-opencv
7. Get bower
* $npm install -g bower
8. Get Pip dependancies
* pip install Flask==0.10.1
* pip install Flask-Mail==0.9.1
* pip install Flask-Migrate==1.4.0
* pip install Flask-RESTful==0.3.4
* pip install Flask-SQLAlchemy==2.0
* pip install Flask-Script==2.0.5
* pip install PyJWT==1.4.0
* pip install PyMySQL==0.6.6
* pip install PyYAML==3.11
* pip install autopep8==1.2.1
* pip install inflect==0.2.5
* pip install marshmallow==2.3.0
* pip install marshmallow-jsonapi==0.3.0
* pip install Numpy==1.11
* pip install Cython==0.23
* pip install Six=1.7.3
* pip install Scipy==0.17.0
* pip install numpydoc==0.6
* pip install psycopg2==2.6
* pip install pycrypto==2.6.1
* pip install uWSGI==2.0.11.2
* pip install scikit-image==0.13.0
9. Get mysql-server (if not already installed)
* apt-get install mysql-server
10. Set up the 'groundtruth_db' database in MySql (installer directory)
* $./database_cleaner.sh
11. Create a new user for the MySql database
* CREATE USER 'gtapp'@'localhost' IDENTIFIED BY '(insert password)';
* grant all privileges on groundtruth_db.* to 'gtapp'@'localhost';
* flush privileges;
12. Modify the file 'config.py' to use the non-root user
* mysql_db_username = '(insert username)'
* mysql_db_password = '(insert password)'
13. Modify the file 'config.py' with a new 32-character Secret Key
* SECRET_KEY = "(insert secret key)"
14. Create a directory 'GT_USERS' outside of the'groudtruth_webapp' directory
* mkdir GT_USERS
15. Set permissons for the application
* chmod -R 777 GT_USERS/
* chmod -R 700 groundtruth_webapp/
* chmod -R 755 groundtruth_webapp/app/
* chmod -R 744 groundtruth_webapp/server_images/
* chmod -R 700 groundtruth_webapp/installer/
15. Run the program
* $python run.py
16. Access the client side
* http://0.0.0.0:8080
17. Create the guest account on the login page
* **Name:** 'Guest'; **Email:** 'guest@guest.com' **Password:** 'guestpw'
18. Insert a test image into 'GT_USER/USER_1/images/' called 'wound.jpg'.

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

### Current Hosted IP Address:
Contact mmccar04@mail.uoguelph.ca to set up a hosting time.
Hosted occasionally on the evenings and weekends.
IP address (updated 11/06/2017): **99.233.250.172:8080**

#### Modules & Packages
TO add additional modules/packages not included with rdash-angular, add them to `bower.json` and then update `index.html`, to include them in the minified distribution output.



## rdash-angular credits
* [Elliot Hesp](https://github.com/Ehesp)
* [Leonel Samayoa](https://github.com/lsamayoa)
* [Mathew Goldsborough](https://github.com/mgoldsborough)
* [Ricardo Pascua Jr](https://github.com/rdpascua)
#### based on the rdash-angular example:
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/rdash/rdash-angular?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
