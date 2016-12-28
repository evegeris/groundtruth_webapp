'''
# http://flask.pocoo.org/docs/0.10/patterns/appfactories/
template_dir = os.path.abspath('app/templates_')
print template_dir

def create_app(config_filename):
    app = Flask(__name__, template_folder=template_dir, static_folder=template_dir+'/static')
    '''

from flask import Flask, render_template, stream_with_context, Response, request, jsonify
import jwt
from jwt import DecodeError, ExpiredSignature
from config import SECRET_KEY, PASSWORD_RESET_EMAIL
import urllib
import cv2
import segmentation
import json

# http://flask.pocoo.org/docs/0.10/patterns/appfactories/


def create_app(config_filename):
    app = Flask(__name__, static_folder='templates/static')
    app.config.from_object(config_filename)


    #Init Flask-SQLAlchemy
    from app.basemodels import db
    db.init_app(app)

    from app.users.views import users
    app.register_blueprint(users, url_prefix='/api/v1/users')

    from app.baseviews import login_required, login1, mail
    from flask import render_template, send_from_directory
    import os

    #Init Flask-Mail
    mail.init_app(app)

    @app.route('/login')
    def login():
        return render_template('login.html')

    @app.route('/<path:filename>')
    def file(filename):
        return send_from_directory(os.path.join(app.root_path, 'templates'), filename)


    def parse_token(req):
        token = req.headers.get('Authorization').split()[1]
        return jwt.decode(token, SECRET_KEY, algorithms='HS256')

    @app.route("/get_json/")
    def getjson():
        from StringIO import StringIO
        import base64

        if not request.headers.get('Authorization'):
            response = jsonify(message='Missing accept header')
            response.status_code = 401
            return response
        try:
            print(request.headers.get('Authorization'))
            payload = parse_token(request)
            #print(payload)
        except DecodeError:
            response = jsonify(message='Token is invalid')
            response.status_code = 401
            return response
        except ExpiredSignature:
            response = jsonify(message='Token has expired')
            response.status_code = 401
            return response

        segmented_filepath = request.args.get('segmented_filepath')
        json_filepath = request.args.get('json_filepath')
        full_json_filepath = os.path.join(app.root_path, 'templates/static/images/') + json_filepath
        print(full_json_filepath)

        email = request.args.get('email')
        print(email)

        with open(full_json_filepath) as json_file:
            json_data = json.load(json_file)

        response = {"json_data": json_data}
        #print(response)
        #response.status_code = 200
        return jsonify(message=response)


    @app.route("/get_crop/")
    def crop():
        from StringIO import StringIO
        import base64

        import cv2
        from matplotlib import pyplot as plt

        if not request.headers.get('Authorization'):
            response = jsonify(message='Missing accept header')
            response.status_code = 401
            return response
        try:
            print(request.headers.get('Authorization'))
            payload = parse_token(request)
            #print(payload)
        except DecodeError:
            response = jsonify(message='Token is invalid')
            response.status_code = 401
            return response
        except ExpiredSignature:
            response = jsonify(message='Token has expired')
            response.status_code = 401
            return response

        x = request.args.get('x')
        y = request.args.get('y')
        w = request.args.get('w')
        h = request.args.get('h')
        email = request.args.get('email')
        filepath = request.args.get('filepath') # original filepath
        #print(filepath)

        # update user_has_image entry with crop info
        # get user id from email, get image id from filepath
        # --> get user_has_image entry

        imDict = segmentation.getSegmentedImage(filepath, app.root_path, int(x), int(y), int(w), int(h))

        dataJSON = json.dumps(imDict)
        print(dataJSON)
        # jsonify imDict and send
        response = jsonify(message=dataJSON)
        print(response)
        response.status_code = 200
        return response
        #return Response(segmentedImgStr, direct_passthrough=True)


    @app.route("/dyn_img/<path:path>")
    def images(path):
        from StringIO import StringIO
        import base64

        #fullpath = os.path.join(app.root_path, 'templates/static/images/') + path
        fullpath = os.path.join(app.root_path, 'templates/static/images/') + path

        print (fullpath)
        myimg = cv2.imread( fullpath )
        #cv2.imshow('myimg', myimg)
        #cv2.waitKey(0)
        print(myimg.size)
        # trying to check if Empty
        # very easy in C++... mat.empty()
        #if (myimg.size == 0)
        #    print("aaaaaaaaaahh img empty")
        encoded = cv2.imencode(".jpg", myimg)[1]
        strImg = base64.encodestring(encoded)

        return Response(strImg, direct_passthrough=True)
        #return render_template("test.html", img_data=urllib.quote(strImg.rstrip('\n')))


    @app.route('/')

    def index():
        return render_template('index.html')

    #Auth API
    app.register_blueprint(login1, url_prefix='/api/v1/')

     # Blueprints


    return app
