'''
# http://flask.pocoo.org/docs/0.10/patterns/appfactories/
template_dir = os.path.abspath('app/templates_')
print template_dir

def create_app(config_filename):
    app = Flask(__name__, template_folder=template_dir, static_folder=template_dir+'/static')
    '''

from flask import Flask, render_template, stream_with_context, Response
import urllib
import cv2

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


    @app.route("/dyn_img/<path:path>")
    def images(path):
        from StringIO import StringIO
        import base64


        fullpath = os.path.join(app.root_path, 'templates/static/images/') + path
        #fullpath = '/home/lainey/code/rdash_Nov23/groundtruth_webapp/app/templates/static/images/wound_images/wound_2.jpg'

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

        print ("#############@@@@@@@@@@@@@@@@@@@@@@")
        return Response(strImg, direct_passthrough=True)
        #return render_template("test.html", img_data=urllib.quote(strImg.rstrip('\n')))


    @app.route('/')

    def index():
        return render_template('index.html')

    #Auth API
    app.register_blueprint(login1, url_prefix='/api/v1/')

     # Blueprints


    return app
