import os
from base64 import b64encode

#Generates a random Key to be used for the Authentication SECRET_KEY in 'config.py'
k = os.urandom(24)
token = b64encode(k).decode('utf-8')
print(token)
