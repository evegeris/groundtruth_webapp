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
import time

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
        full_json_filepath = request.args.get('json_filepath')
        #full_json_filepath = os.path.join(app.root_path, 'templates/static/images/') + json_filepath
        print(full_json_filepath)

        # removing extra segmentation and json files not being used
        left_seg, right_seg = segmented_filepath.split('_', 1 )
        left_json, right_json = full_json_filepath.split('_', 1 )
        left_seg = left_seg[len(left_seg)-3:len(left_seg)]
        print(left_seg)
        print(right_seg)
        fp = os.getcwd()
        fp = fp.rsplit('/',1)[0] # go back one dir

        if (left_seg != "100"):
                os.remove(fp + '/segmented/100_'+right_seg)
                os.remove(fp + '/json/100_'+right_json) 
        if (left_seg != '400'):
                os.remove(fp + '/segmented/400_'+right_seg)
                os.remove(fp + '/json/400_'+right_json) 
        if (left_seg != '566'):
                os.remove(fp + '/segmented/566_'+right_seg)
                os.remove(fp + '/json/566_'+right_json) 
        if (left_seg != '600'):
                os.remove(fp + '/segmented/600_'+right_seg)
                os.remove(fp + '/json/600_'+right_json) 
        if (left_seg != '666'):
                os.remove(fp + '/segmented/666_'+right_seg)
                os.remove(fp + '/json/666_'+right_json)            

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
        print(filepath)

        try:
            imDict = segmentation.getSegmentedImage(filepath, app.root_path, int(x), int(y), int(w), int(h))
        except TypeError:
            print("Image not found!")
            response = jsonify(message="Image not found!")
            response.status_code = 401
            return response

        dataJSON = json.dumps(imDict)
        print(dataJSON)
        # jsonify imDict and send
        response = jsonify(message=dataJSON)
        print(response)
        response.status_code = 200
        return response
        #return Response(segmentedImgStr, direct_passthrough=True)



    #Custom save of file on server
    @app.route("/get_localsave/")
    def localsave():
        from StringIO import StringIO
        import base64

        import cv2
        from matplotlib import pyplot as plt

        

        img = request.args.get('image')

        email = request.args.get('email')

        #img_cv = cv2.imread(img);
        #cv2.imshow("input", img_cv)
        #print(img)

        try:


            lhs, rhs = img.split(',', 1 )
            fp = os.getcwd()
            fp = fp.rsplit('/',1)[0] # go back one dir
            fullpath_segmented_dirty = fp + '/wound_images/' + "temp_user.jpg"
            #relative_segmented = 'wound_images/' + postprocessor.out_files[idx] + "user.jpg"
            fh = open(fullpath_segmented_dirty, "wb")
            fh.write(rhs.decode('base64'))
            fh.close()

            # Mediocre virus protection: augment image slightly, then delete the old image

            try:
                temp_img = cv2.imread(fullpath_segmented_dirty)
                height, width, channels = temp_img.shape
                crop_img = temp_img[2:2+height-2, 2:2+width-2]  # NOTE: its img[y: y + h, x: x + w]
                fullpath_segmented_clean = fp + '/wound_images/' + "user.jpg"
                cv2.imwrite(fullpath_segmented_clean, crop_img)
            except:
                os.remove(fullpath_segmented_dirty)
                print("Bad Request!")
                response = jsonify(message="Bad Request!")
                response.status_code = 400
                return response
                

            try:
                os.remove(fullpath_segmented_dirty)
            except OSError:
                pass

        except TypeError:
            print("Permission Denied!")
            response = jsonify(message="Permission Denied!")
            response.status_code = 401
            return response

        #dataJSON = json.dumps(imDict)
        #print(dataJSON)
        # jsonify imDict and send
        response = jsonify(message=fullpath_segmented_clean)
        #print(response)
        response.status_code = 200
        return response
        #return Response(segmentedImgStr, direct_passthrough=True)

    #End of custom save file on server



    @app.route("/dyn_img/fp=/<path:path>")
    def images(path):
        from StringIO import StringIO
        import base64

        #fullpath = os.path.join(app.root_path, 'templates/static/images/') + path
        # update: full path in DB:
        fullpath = '/'+path
        print (fullpath)
        myimg = cv2.imread( fullpath )

        # how do you cehck if an arbitrary variable in python is null
        # supposed to be able to do 'if not nameofimg' for numpy array
        # so why the compilation err
        '''
        try:
            myimg = float(myimg)
        except ValueError:
            print ('nope')
            return Response('nope', direct_passthrough=True)
            '''

        try:
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
        except ValueError:
            return Response("Image not found!", direct_passthrough=True)


    @app.route('/')

    def index():
        return render_template('index.html')

    #Auth API
    app.register_blueprint(login1, url_prefix='/api/v1/')

     # Blueprints


    return app
