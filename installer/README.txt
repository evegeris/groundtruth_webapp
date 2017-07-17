Installer Directory README:

There are two pairs of files in the installer directory:

1. installer-ubuntu14+.sh  &&  cmds.txt

The 'installer-ubuntu14+.sh' script will acquire all of the packages needed for the website and
set up the MySql database by using the 'cmds.txt' file. 

2. database_cleaner.sh  &&  cleaner.txt

The 'database_cleaner.sh' script resets the MySql database by using the 'cleaner.txt' file. This script
should be used if the MySql database needs to be reset (useful during testing of the system). 
