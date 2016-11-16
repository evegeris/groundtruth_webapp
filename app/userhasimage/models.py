from marshmallow_jsonapi import Schema, fields
from marshmallow import validate
from app.basemodels import db, CRUD_MixIn

class UserHasImage(db.Model, CRUD_MixIn):
    id = db.Column(db.Integer, primary_key=True)

    fullsize_orig_filepath = db.Column(db.String(250), nullable=False, unique=True)
    crop_orig_filepath = db.Column(db.String(250), nullable=True, unique=True)
    crop_overlay_filepath = db.Column(db.String(250), nullable=True, unique=True)
    crop_segm_filepath = db.Column(db.String(250), nullable=True, unique=True)
    classified_segments = db.Column(db.String(250), nullable=True, unique=True)
    algorithm = db.Column(db.String(45), nullable=True, unique=True)
    progress = db.Column(db.Integer, nullable=True)
    n_segments = db.Column(db.Integer, nullable=True)

    def __init__(self,  fullsize_orig_filepath):
        self.fullsize_orig_filepath = fullsize_orig_filepath
        self.progress = 0


class UserHasImageSchema(Schema):

    not_blank = validate.Length(min=1, error='Field cannot be blank')
    # add validate=not_blank in required fields
    id = fields.Integer(dump_only=True)

    fullsize_orig_filepath = fields.String(validate=not_blank)

    # self links
    def get_top_level_links(self, data, many):
        if many:
            self_link = "/userhasimage/"
        else:
            self_link = "/userhasimage/{}".format(data['id'])
        return {'self': self_link}

    class Meta:
type_ = 'userhasimage'
