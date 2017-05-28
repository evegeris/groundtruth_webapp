'''
# http://flask.pocoo.org/docs/0.10/patterns/appfactories/
template_dir = os.path.abspath('app/templates_')
print template_dir

def create_app(config_filename):
    app = Flask(__name__, template_folder=template_dir, static_folder=template_dir+'/static')
    '''

from flask import Flask, render_template, stream_with_context, Response, request, jsonify
import jwt
from jwt import DecodeError, ExpiredSignature, decode
from config import SECRET_KEY, PASSWORD_RESET_EMAIL
import urllib
import cv2
import segmentation
import json
import time
from shutil import copyfile, make_archive
from io import BytesIO
import base64
import threading

# http://flask.pocoo.org/docs/0.10/patterns/appfactories/


def create_app(config_filename):
    app = Flask(__name__, static_folder='templates/static')
    app.config.from_object(config_filename)


    #Init Flask-Alchemy
    from app.basemodels import db
    db.init_app(app)

    from app.users.views import users
    app.register_blueprint(users, url_prefix='/api/v1/users')

    from app.baseviews import login_required, login1, mail
    from flask import render_template, send_from_directory
    import os

    #Init Flask-Mail
    mail.init_app(app)


    #Create a background thread that can be responsible for wiping the directories periodically
    #Note: In debugger mode, two threads are spawned (since Flask makes two threads so that it can restart on the fly)
    def systemCleaner():

        time.sleep(60) #Scan every 60 seconds
        clk = time.ctime()        
        print(clk)
        clk_list = clk.split(' ')
        time_list = clk_list[3].split(':')

        fp = os.getcwd()
        fp = fp.rsplit('/',1)[0]
        fileListJSON = os.listdir(fp+"/json")
        fileListCropped = os.listdir(fp+"/cropped")
        fileListSegmented = os.listdir(fp+"/segmented")
        fileListLabelled = os.listdir(fp+"/labelled")

        print(len(fileListJSON))

        # Want to erase all temperory (and potentially in use files)
        # Periodic Clense each day at midnight
        # Clense if the directories grow to a certain size (could potentially erase someones in progress work)
        if (time_list[0] == "24" and time_list[1] == "00") or len(fileListJSON) > 500 or len(fileListCropped) > 250 or len(fileListSegmented) > 250 or len(fileListLabelled) > 250:
            print("server reset...")


            for fileNameJSON in fileListJSON:
                os.remove(fp+"/json"+"/"+fileNameJSON)
            for fileNameCropped in fileListCropped:
                os.remove(fp+"/cropped"+"/"+fileNameCropped)
            for fileNameSegmented in fileListSegmented:
                os.remove(fp+"/segmented"+"/"+fileNameSegmented)
            for fileNameLabelled in fileListLabelled:
                os.remove(fp+"/labelled"+"/"+fileNameLabelled)


        th = threading.Thread(target=systemCleaner)
        th.daemon = True;
        th.start()
       
    #Spawn the first thread
    th = threading.Thread(target=systemCleaner)
    th.daemon = True;
    th.start()

    


    #Called from multiple scripts to revert to the base login screen
    @app.route('/login')
    def login():
        return render_template('login.html')


    #Navigates to the different directories in the document
    @app.route('/<path:filename>')
    def file(filename):
        return send_from_directory(os.path.join(app.root_path, 'templates'), filename)


    #Function used to decode the authentication Key which prevents CSRF
    def parse_token(req):
        token = req.headers.get('Authorization').split()[1]
        return jwt.decode(token, SECRET_KEY, algorithms='HS256')

    #Called from the 'crop.js' script when the user is ready to proceed to the labelling screen
    #Authenticates, does security check, cleans any unused files, returns the JSON file for the labeling algorithm
    @app.route("/get_json/")
    def getjson():

        from StringIO import StringIO
        import base64

        if not request.headers.get('Authorization'):
            response = jsonify(message='Missing accept header')
            response.status_code = 401
            return response
        try:
            payload = parse_token(request)
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


        if (not segmented_filepath.endswith('.jpg')) or (not segmented_filepath.startswith('segmented')):
            response = jsonify(message='Invalid File')
            response.status_code = 400
            return response

        if not json_filepath.endswith('.json') or not json_filepath.startswith('json'):
            response = jsonify(message='Invalid File')
            response.status_code = 400
            return response
    

        # removing extra segmentation and json files not being used
        left_seg, right_seg = segmented_filepath.split('_', 1 )
        left_json, right_json = json_filepath.split('_', 1 )

        left_seg = left_seg[len(left_seg)-3:len(left_seg)]

        fp = os.getcwd()
        fp = fp.rsplit('/',1)[0] # go back one dir

        if (left_seg != "466"):
                os.remove(fp + '/segmented/466_'+right_seg)
                os.remove(fp + '/json/466_'+right_json) 
        if (left_seg != '500'):
                os.remove(fp + '/segmented/500_'+right_seg)
                os.remove(fp + '/json/500_'+right_json) 
        if (left_seg != '566'):
                os.remove(fp + '/segmented/566_'+right_seg)
                os.remove(fp + '/json/566_'+right_json) 
        if (left_seg != '600'):
                os.remove(fp + '/segmented/600_'+right_seg)
                os.remove(fp + '/json/600_'+right_json) 
        if (left_seg != '666'):
                os.remove(fp + '/segmented/666_'+right_seg)
                os.remove(fp + '/json/666_'+right_json)            

        with open(fp + '/' + json_filepath) as json_file:
            json_data = json.load(json_file)

        response = {"json_data": json_data}
        #print(response)
        #response.status_code = 200
        return jsonify(message=response)


    #Called from the 'crop.js' script. Sends the image to the superpixel segmentation script for cropping
    #Authenticates, runs segmentation script, returns segmented images
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
            payload = parse_token(request)
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
        filepath = request.args.get('filepath')

        if (not filepath.endswith('.jpg')) or (not filepath.startswith('wound_images')):
            response = jsonify(message='Invalid File')
            response.status_code = 400
            return response

        try:
            imDict = segmentation.getSegmentedImage(filepath, app.root_path, int(x), int(y), int(w), int(h))
        except TypeError:
            print("SLIC crashed")
            response = jsonify(message="Internal Server Error")
            response.status_code = 500
            return response

        dataJSON = json.dumps(imDict)
        #print(dataJSON)

        # jsonify imDict and send
        response = jsonify(message=dataJSON)
        response.status_code = 200
        return response




    #Called from the 'crop.js' script.
    #Authenticates, transmutes the image for security, then saves it locally and returns the transmuted image
    @app.route("/get_localsave/")
    def localsave():
        from StringIO import StringIO
        import base64

        import cv2
        from matplotlib import pyplot as plt


        if not request.headers.get('Authorization'):
            response = jsonify(message='Missing accept header')
            response.status_code = 401
            return response
        try: 
            payload = parse_token(request)
            #print(request.headers.get('Authorization'))
            #print(payload)

        except DecodeError:
            response = jsonify(message='Token is invalid')
            response.status_code = 401
            return response
        except ExpiredSignature:
            response = jsonify(message='Token has expired')
            response.status_code = 401
            return response

        img = request.args.get('image')
        email = request.args.get('email')


        try:
            lhs, rhs = img.split(',', 1 )
            fp = os.getcwd()
            fp = fp.rsplit('/',1)[0]
            fullpath_segmented_dirty = fp + '/wound_images/' + "temp_user.jpg"

            fh = open(fullpath_segmented_dirty, "wb")
            fh.write(rhs.decode('base64'))
            fh.close()

            #Image Augmentation
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
            print("Internal Server Error")
            response = jsonify(message="Internal Server Error!")
            response.status_code = 500
            return response


        response = jsonify(message="wound_images/user.jpg")
        response.status_code = 200
        return response



    #Called from the 'canvas.js' script. 
    # Takes the dictionairy and creates a .zip file with every important document
    @app.route("/get_saveLabel/")
    def saveLabel():
        from StringIO import StringIO
        import base64

        import cv2
        from matplotlib import pyplot as plt

        if not request.headers.get('Authorization'):
            response = jsonify(message='Missing accept header')
            response.status_code = 401
            return response
        try:
            payload = parse_token(request)
        except DecodeError:
            response = jsonify(message='Token is invalid')
            response.status_code = 401
            return response
        except ExpiredSignature:
            response = jsonify(message='Token has expired')
            response.status_code = 401
            return response

        
        data1 = request.args.get('data1') #Dictionary
        data2 = request.args.get('data2') #Completed Integer Mask
        data2_split = data2.split("]") 
  
        segPath = request.args.get('segPath')

        if (not segPath.endswith('.jpg')) or (not segPath.startswith('segmented')):
            response = jsonify(message='Invalid File')
            response.status_code = 400
            return response

        left_seg, right_seg = segPath.split('_', 1 )
        left_seg = left_seg[len(left_seg)-3:len(left_seg)]

        right_seg, garb = right_seg.split('.',1) 
        right_seg = right_seg[0:len(right_seg)-9]

        date_time_clean = left_seg + '_'+ right_seg
        right_seg = right_seg + 'dictionary'

        date_time = left_seg + '_' + right_seg              
                        
        # Saving the file
        try:
            fp = os.getcwd()
            fp = fp.rsplit('/',1)[0] # go back one dir
            fp_orig = fp
            fullpath_label = fp + '/labelled/' + date_time + '.json'
            fh = open(fullpath_label, "wb")
            fh.write(data1) #Saving the dictionary
            fh.close()


            fullpath_label = fp + '/labelled/' + date_time_clean + 'labelled.json'
            fh = open(fullpath_label, "wb")
            for i in range(0,len(data2_split)-1):
                fh.write(data2_split[i]) #Saving the integer mask (formatting for better viewing)
                fh.write("]\n")                
            fh.close()


            #Need to package everything in .zip file for download
            fp = os.getcwd()
            fp = fp.rsplit('/',1)[0] # go back one dir
            fp = fp + '/packaged/' + date_time
            # Making the directory
            if not os.path.exists(fp):
                os.makedirs(fp)
            fp = fp + '/'
        
            #Copying all the files
            copyfile(fp_orig+'/cropped/'+date_time_clean[4:len(date_time_clean)]+'cropped.jpg', fp+date_time_clean[4:len(date_time_clean)]+'cropped.jpg')
            copyfile(fp_orig+'/json/'+date_time_clean[0:len(date_time_clean)-1]+'.json', fp+date_time_clean+'.json')
            copyfile(fp_orig+'/labelled/'+date_time_clean+'dictionary.json', fp+date_time_clean+'dictionary.json')
            copyfile(fp_orig+'/labelled/'+date_time_clean+'labelled.json', fp+date_time_clean+'labelled.json')
            copyfile(fp_orig+'/segmented/'+date_time_clean+'segmented.jpg', fp+date_time_clean+'segmented.jpg')

            #Example of how to open a JSON file to extract each row
            #with open(fp+date_time_clean+'labelled.json') as json_labelled:
                #d = json.load(json_labelled)
                #print(d[0])
                    

        
            # Zip the new directory for download
            make_archive(fp_orig+'/packaged/'+date_time_clean[0:len(date_time_clean)-1], 'zip', fp[0:len(fp)-1])

            # Extract the data to send over http
            with open(fp_orig+'/packaged/'+date_time_clean[0:len(date_time_clean)-1]+'.zip', 'r') as content_file:
                content = content_file.read()

        except:
            print("Internal Server Error!")
            response = jsonify(message="Internal Server Error!")
            response.status_code = 500
            return response

        # File Path for the created zip file
        fp_zip = fp_orig+'/packaged/'+date_time_clean[0:len(date_time_clean)-1]+'.zip'

        # Not allowed to send Binary over HTTP, must be UTF-8 format (base64)
        with open(fp_zip, 'rb') as fin, open(fp_orig+'/packaged/'+'output.zip.b64', 'w') as fout:
            base64.encode(fin, fout)
        
        #Send the Base64 file and decode on the client side
        return send_from_directory(fp_orig+'/packaged', 'output.zip.b64')


    #Dynamically loads in an image, used from multiple scripts.
    #Does security check in image, then returns the image    
    @app.route("/dyn_img/fp=/<path:path>")
    def images(path):
        from StringIO import StringIO
        import base64

        pathPass = False;

        if not request.headers.get('Authorization'):
            response = jsonify(message='Missing accept header')
            response.status_code = 401
            return response
        try:
            payload = parse_token(request)
        except DecodeError:
            response = jsonify(message='Token is invalid')
            response.status_code = 401
            return response
        except ExpiredSignature:
            response = jsonify(message='Token has expired')
            response.status_code = 401
            return response


        if (not (path.endswith('.jpg') or path.endswith('.png'))):
            response = jsonify(message='Invalid File Extension')
            response.status_code = 400
            return response

        if (path.startswith('groundtruth_webapp')):
            pathList = path.split('/')
            print(pathList[1])
            if (pathList[1]=="server_images"):
                pathPass = True;

        if not ((path.startswith('wound_images')) or (path.startswith('segmented')) or (path.startswith('cropped')) or (pathPass)):
            response = jsonify(message='Restricted Access')
            response.status_code = 401
            return response

        fp = os.getcwd()
        fp = fp.rsplit('/',1)[0] # go back one dir
        fullpath = fp+'/'+path
        myimg = cv2.imread( fullpath )

        #Encode the image to send over HTTP (only .jpg to save server space)
        try:
            encoded = cv2.imencode(".png", myimg)[1]
            strImg = base64.encodestring(encoded)
            return Response(strImg, direct_passthrough=True)
        except ValueError:
            response = jsonify(message='Internal Server Error')
            response.status_code = 500
            return response


    #Used for the base call to the webpage to provide index file
    @app.route('/')
    def index():
        return render_template('index.html')

    #Auth API
    app.register_blueprint(login1, url_prefix='/api/v1/')

    # Blueprints

    return app
