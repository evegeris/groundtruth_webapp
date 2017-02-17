from marshmallow_jsonapi import Schema, fields
from marshmallow import validate
from app.basemodels import db, CRUD_MixIn

class Images(db.Model, CRUD_MixIn):
    id = db.Column(db.Integer, primary_key=True)

    fullsize_orig_filepath = db.Column(db.String(250), nullable=False, unique=True)

    def __init__(self,  fullsize_orig_filepath):
        self.fullsize_orig_filepath = fullsize_orig_filepath



class ImagesSchema(Schema):

    not_blank = validate.Length(min=1, error='Field cannot be blank')
    # add validate=not_blank in required fields
    id = fields.Integer(dump_only=True)

    fullsize_orig_filepath = fields.String(validate=not_blank)

    # self links
    def get_top_level_links(self, data, many):
        if many:
            self_link = "/images/"
        else:
            self_link = "/images/{}".format(data['id'])
        return {'self': self_link}

    class Meta:
        type_ = 'images'
