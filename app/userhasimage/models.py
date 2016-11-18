from marshmallow_jsonapi import Schema, fields
from marshmallow import validate
from app.basemodels import db, CRUD_MixIn

class UserHasImage(db.Model, CRUD_MixIn):
    id = db.Column(db.Integer, primary_key=True)
    users_id = db.Column(db.Integer, nullable=False, primary_key=False)
    images_id = db.Column(db.Integer, nullable=False, primary_key=False)


    def __init__(self,  fullsize_orig_filepath):
        print("")


class UserHasImageSchema(Schema):

    not_blank = validate.Length(min=1, error='Field cannot be blank')

    # self links
    def get_top_level_links(self, data, many):
        if many:
            self_link = "/userhasimage/"
        else:
            self_link = "/userhasimage/{}".format(data['id'])
        return {'self': self_link}

    class Meta:
        type_ = 'userhasimage'
