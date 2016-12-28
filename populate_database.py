# set root filepath to images on server through config.py
# standalone script to enter all image filepaths into database
# currently only looks for img files with extension .jpg or .png

import sqlalchemy
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import func, join, select
from app.images.models import Images, ImagesSchema
from config import mysql_db_name, mysql_db_username, mysql_db_password, mysql_db_name, mysql_db_hostname, dataset_root
from sqlalchemy import create_engine
from os import listdir
from os.path import isfile, join
from app.images.models import Images, ImagesSchema


# parse command line args
# this just became deprecated but I can't bring myself to delete it yet
# maybe we'll need it somewhere else
'''
import argparse
parser = argparse.ArgumentParser(description='Get your image-based dataset into a database. If no folder name specified, dataset assumed to be in ')
parser.add_argument('--rootfp', metavar='root/fp/to/images', type=str,
                    help='root filepath to images')
args = parser.parse_args()
print args.rootfp
rootfp = ''
if args.rootfp:
    rootfp = args.rootfp
else:
    rootfp = 'dataset'
rootfp = ''
'''
rootfp = dataset_root

import os
fp = os.getcwd()
fp = fp.rsplit('/',1)[0] # go back one dir
fp = fp + '/' + rootfp + '/Artificial'
print fp


# get filenames
onlyfiles = [f for f in listdir(fp)
if not f.startswith('.') and (f.endswith('.jpg') or f.endswith('.png')) and isfile(join(fp, f))]
print onlyfiles

# create DB entries for every filepath
'''
# connect to db
engine = create_engine('mysql://'+mysql_db_username+':'+mysql_db_password+'@'+mysql_db_hostname, echo=True)
engine.execute("USE "+mysql_db_name) # select new db
connection = engine.connect()
db_session = Session(bind=connection)

#stmt = sqlalchemy.sql.expression.insert(Images, values=['test'])
#engine.execute(stmt).fetchall()

for everyfile in onlyfiles:
    img = Images(everyfile)
    db_session.add(img)

# my_timestamp_id = my_timestamp.get_id() You don't need to do this
#for r in datarecords:
#    db_session.add(dr)
db_session.commit()

connection.close()
'''
