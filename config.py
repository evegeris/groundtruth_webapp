# location of dataset relative to root folder containing groundtruth_webapp
dataset_root = 'dataset'

# DATABASE SETTINGS

# MYSQL
mysql_db_username = '(insert username)'
mysql_db_password = '(insert password)'
mysql_db_name = 'groundtruth_db'
mysql_db_hostname = 'localhost'

# WARNING: Set DEBUG to false if external hosting
DEBUG = False
MAINTAIN = True
PORT = 8080
HOST = "0.0.0.0"
SQLALCHEMY_ECHO = False
SECRET_KEY = "(insert secret key)"



# MySQL
SQLALCHEMY_DATABASE_URI = "mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_ADDR}/{DB_NAME}".format(DB_USER=mysql_db_username,
                                                                                        DB_PASS=mysql_db_password,
                                                                                        DB_ADDR=mysql_db_hostname,
                                                                                        DB_NAME=mysql_db_name)
# Email Server Configuration

MAIL_DEFAULT_SENDER = "leo@localhost"

PASSWORD_RESET_EMAIL ="""
    Hi,

      Please click on the link below to reset your password

      <a href="/forgotpassword/{token}> Click here </a>"""
