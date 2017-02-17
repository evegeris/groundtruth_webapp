from flask import Blueprint, request, jsonify, make_response
from app.userhasimage.models import UserHasImage, UserHasImageSchema
from flask_restful import Api
from app.baseviews import Resource
from app.basemodels import db
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func
from marshmallow import ValidationError
from werkzeug.security import generate_password_hash

userhasimage = Blueprint('userhasimage', __name__)
# http://marshmallow.readthedocs.org/en/latest/quickstart.html#declaring-schemas
# https://github.com/marshmallow-code/marshmallow-jsonapi
schema = UserHasImageSchema(strict=True)
api = Api(userhasimage)

# UserHasImage

class CreateListUserHasImage(Resource):

    def get(self):
        userhasimage_query = UserHasImage.query.all()
        results = schema.dump(userhasimage_query, many=True).data
        return results


    def post(self):
        raw_dict = request.get_json(force=True)
        try:
            schema.validate(raw_dict)
            request_dict = raw_dict['data']['attributes']
            user = UserHasImage(request_dict['email'], generate_password_hash(request_dict['password']), request_dict['name'], request_dict[
                         'active'], request_dict['role'],)
            user.add(user)
            # Should not return password hash
            query = UserHasImage.query.get(user.id)
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


class GetUpdateDeleteUser(Resource):

    def get(self, id):
        user_query = UserHasImage.query.get_or_404(id)
        result = schema.dump(user_query).data
        return result

    """http://jsonapi.org/format/#crud-updating"""

    def patch(self, id):
        user = UserHasImage.query.get_or_404(id)
        raw_dict = request.get_json(force=True)
        try:
            schema.validate(raw_dict)
            request_dict = raw_dict['data']['attributes']
            for key, value in request_dict.items():
                setattr(user, key, value)

            user.update()
            return self.get(id)

        except ValidationError as err:
            resp = jsonify({"error": err.messages})
            resp.status_code = 401
            return resp

        except SQLAlchemyError as e:
            db.session.rollback()
            resp = jsonify({"error": str(e)})
            resp.status_code = 401
            return resp

    # http://jsonapi.org/format/#crud-deleting
    # A server MUST return a 204 No Content status code if a deletion request
    # is successful and no content is returned.
    def delete(self, id):
        user = UserHasImage.query.get_or_404(id)
        try:
            delete = user.delete(user)
            response = make_response()
            response.status_code = 204
            return response

        except SQLAlchemyError as e:
            db.session.rollback()
            resp = jsonify({"error": str(e)})
            resp.status_code = 401
            return resp


api.add_resource(CreateListUserHasImage, '.json')
api.add_resource(GetUpdateDeleteUser, '/<int:id>.json')
