# Token Auth functions
import jwt
from jwt import DecodeError, ExpiredSignature
from config import SECRET_KEY, PASSWORD_RESET_EMAIL
from datetime import datetime, timedelta
from functools import wraps
from flask import g, Blueprint, jsonify, make_response, request
from flask_restful import Resource, Api
import flask_restful
from app.users.models import Users, UsersSchema
from app.images.models import Images, ImagesSchema
from app.userhasimage.models import UserHasImage, UserHasImageSchema
from werkzeug.security import check_password_hash, generate_password_hash
from marshmallow import ValidationError
from app.basemodels import db
from flask_mail import Mail, Message
from sqlalchemy import func, join, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.declarative import DeclarativeMeta

import json

login1 = Blueprint('login', __name__)
api = Api(login1)
schema = UsersSchema(strict=True)
mail = Mail()

# JWT AUTh process start


def create_token(user):
    payload = {
        'sub': user.id,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(days=1),
        'scope': user.role
    }
    token = jwt.encode(payload, SECRET_KEY)
    return token.decode('unicode_escape')


def parse_token(req):

    token = req.headers.get('Authorization').split()[1]
    return jwt.decode(token, SECRET_KEY, algorithms='HS256')

# Login decorator function


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.headers.get('Authorization'):
            response = jsonify(message='Missing authorization header')
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

        g.user_id = payload['sub']

        return f(*args, **kwargs)

    return decorated_function


def admin_login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not request.headers.get('Authorization'):
            response = jsonify(message='Missing authorization header')
            response.status_code = 401
            return response

        try:
            # print(request.headers.get('Authorization'))
            payload = parse_token(request)
            if payload['scope'] != "admin":
                response = jsonify(error='Admin Access Required')
                response.status_code = 401
                return response
        except DecodeError:
            response = jsonify(message='Token is invalid')
            response.status_code = 401
            return response
        except ExpiredSignature:
            response = jsonify(message='Token has expired')
            response.status_code = 401
            return response

        g.user_id = payload['sub']

        return f(*args, **kwargs)

    return decorated_function

# JWT AUTh process end

# Login Authentication Class


class Auth(Resource):

    def post(self):
        raw_dict = request.get_json(force=True)
        data = raw_dict['data']['attributes']
        email = data['email']
        password = data['password']
        #print '##################################'
        #print 'received email: ' + email + ', pass: ' + password
        user = Users.query.filter_by(email=email).first()
        if user == None:
            response = make_response(
                jsonify({"message": "invalid username"}))
            response.status_code = 401
            return response
        #print '******hash: ' + generate_password_hash(password)
        if check_password_hash(user.password, password):
            token = create_token(user)
            return {'token': token}
        else:
            response = make_response(
                jsonify({"message": "invalid password"}))
            response.status_code = 401
            return response

api.add_resource(Auth, 'login.json')


class AlchemyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj.__class__, DeclarativeMeta):
            # an SQLAlchemy class
            fields = {}
            for field in [x for x in dir(obj) if not x.startswith('_') and x != 'metadata']:
                data = obj.__getattribute__(field)
                try:
                    json.dumps(data) # this will fail on non-encodable values, like other classes
                    fields[field] = data
                except TypeError:
                    fields[field] = None
            # a json-encodable dict
            return fields

        return json.JSONEncoder.default(self, obj)


class UserInfo(Resource):

    def get(self):
        email = request.args.get('email')
        #print("email:\n"+email)
        user = Users.query.filter_by(email=email).first()
        if user is not None:
            #print("user imgs: "+ str(user.classified))
            print("user id: " + str(user.id))

            j = join(Images, UserHasImage,
            UserHasImage.users_id == UserHasImage.images_id)
            stmt = select([Images.id, Images.fullsize_orig_filepath, Images.progress]).select_from(j).distinct()
            print(str(stmt))

            result = db.session.execute(stmt)
            user_images = result.fetchall();
            #row = result.fetchone()
            #print("id:", row['id'], "; filpeath:", "progress:", row['progress'], "; filpeath:", row['fullsize_orig_filepath'])

            #for row in user_images:
            #    for field in row:
            #        print(field)

            imgs_json = json.dumps([(dict(row.items())) for row in user_images])
            print(imgs_json)

            #print json.dumps(user, cls=AlchemyEncoder)
            #print(user_images)

            user_info = {
                'classified': user.classified,
                'in_queue': user.in_queue,
                'full_name': user.name,
                'image_info': [(dict(row.items())) for row in user_images]
            }

            response = jsonify(message=user_info)
            response.status_code = 200
            return response
        else:
            return {"error": "Invalid email :("}, 404


api.add_resource(UserInfo, 'userinfo')



class SignUp(Resource):

    def post(self):
        raw_dict = request.get_json(force=True)
        try:
            schema.validate(raw_dict)
            request_dict = raw_dict['data']['attributes']
            role = None
            active = 0
            classified = 0
            in_queue = 0
            user = Users(request_dict['email'], generate_password_hash(request_dict['password']), request_dict['name'], active, role, classified, in_queue)
            user.add(user)
            # Should not return password hash
            query = Users.query.get(user.id)
            results = schema.dump(query).data
            return results, 201

        except ValidationError as err:
            resp = jsonify({"error": err.messages})
            resp.status_code = 403
            return resp

        except SQLAlchemyError as e:
            db.session.rollback()
            resp = jsonify({"error": str(e)})
            resp.status_code = 403
            return resp


api.add_resource(SignUp, 'signup.json')


class ForgotPassword(Resource):

    def patch(self):
        if not request.headers.get('Authorization'):
            response = jsonify(message='Missing authorization header')
            response.status_code = 401
            return response

        try:
            print(request.headers.get('Authorization'))
            payload = parse_token(request)
            user_id = payload['sub']
            user = Users.query.get_or_404(user_id)
            print(request.data)
            raw_dict = request.get_json(force=True)
            request_dict = raw_dict['data']['attributes']

            user.password = generate_password_hash(request_dict['password'])
            try:
                user.update()
                return 201

            except SQLAlchemyError as e:
                db.session.rollback()
                resp = jsonify({"error": str(e)})
                resp.status_code = 401
                return resp
        except DecodeError:
            response = jsonify(message='Token is invalid')
            response.status_code = 401
            return response
        except ExpiredSignature:
            response = jsonify(message='Token has expired')
            response.status_code = 401
            return response

    def post(self):
        request_dict = request.get_json(force=True)['data']['attributes']
        email = request_dict['email']
        user = Users.query.filter_by(email=email).first()
        if user is not None:
            token = create_token(user)
            msg = Message("Here's your Password Reset Link :)",
                          recipients=[email])
            msg.html = PASSWORD_RESET_EMAIL.format(token=token)
            mail.send(msg)
            return {"message": "Password reset mail sent successfully"}, 201
        else:
            return {"error": "We could not find this email address :("}, 404

api.add_resource(ForgotPassword, 'forgotpassword')

# Adding the login decorator to the Resource class


class Resource(flask_restful.Resource):
    method_decorators = [login_required]
