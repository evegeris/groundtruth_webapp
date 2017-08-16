#!/bin/sh

apt-get update

apt-get install git -y

apt-get install python-setuptools -y

apt-get install python-dev build-essential -y

apt-get install python-pip -y

apt-get install nodejs -y

apt-get install npm -y

apt-get install libpq-dev python-dev -y

apt-get install python-tk -y

apt-get install python-opencv -y

npm install -g bower



pip install Flask==0.10.1

pip install Flask-Mail==0.9.1

pip install Flask-Migrate==1.4.0

pip install Flask-RESTful==0.3.4

pip install Flask-SQLAlchemy==2.0

pip install Flask-Script==2.0.5

pip install PyJWT==1.4.0

pip install PyMySQL==0.6.6

pip install PyYAML==3.11

pip install autopep8==1.2.1

pip install inflect==0.2.5

pip install marshmallow==2.3.0

pip install marshmallow-jsonapi==0.3.0

pip install Numpy==1.11

pip install Cython==0.23

pip install Six=1.7.3

pip install Scipy==0.17.0

pip install numpydoc==0.6

pip install psycopg2==2.6

pip install pycrypto==2.6.1

pip install uWSGI==2.0.11.2

pip install scikit-image==0.13.0

mysql -u root -p < cmds.txt

cd ..

cd ..

mkdir GT_USERS

chmod -R 777 GT_USERS/

chmod -R 700 groundtruth_webapp/

chmod -R 755 groundtruth_webapp/app/

chmod -R 744 groundtruth_webapp/server_images/

chmod -R 700 groundtruth_webapp/installer/

cd groundtruth_webapp
