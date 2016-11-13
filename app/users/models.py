from marshmallow_jsonapi import Schema, fields
from marshmallow import validate
from app.basemodels import db, CRUD_MixIn

class Images(db.Model, CRUD_MixIn):
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

class Users(db.Model, CRUD_MixIn):
    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(250), nullable=False, unique=True)
    password = db.Column(db.String(250), nullable=False)
    name = db.Column(db.String(250), nullable=False)
    active = db.Column(db.Integer, nullable=False)
    classified = db.Column(db.Integer, nullable=False)
    in_queue = db.Column(db.Integer, nullable=False)
    creation_time = db.Column(
        db.TIMESTAMP, server_default=db.func.current_timestamp(), nullable=False)
    modification_time = db.Column(db.TIMESTAMP)
    role = db.Column(db.String(250))
    # db.ForeignKey('roles.name')
    # many users to one  role relationship
#    role_relation = db.relationship('Roles', backref="users")

    def __init__(self,  email,  password,  name,  active,  role, classified, in_queue):
        self.email = email
        self.password = password
        self.name = name
        self.active = active
        self.role = role
        self.classified = classified
        self.in_queue = in_queue


class UsersSchema(Schema):

    not_blank = validate.Length(min=1, error='Field cannot be blank')
    # add validate=not_blank in required fields
    id = fields.Integer(dump_only=True)

    email = fields.Email(validate=not_blank)
    password = fields.String(validate=not_blank)
    name = fields.String(validate=not_blank)
    active = fields.Integer()
    classified = fields.Integer()
    in_queue = fields.Integer()
    creation_time = fields.DateTime(dump_only=True)
    modification_time = fields.DateTime(dump_only=True)
    role = fields.String(validate=not_blank)

    # self links
    def get_top_level_links(self, data, many):
        if many:
            self_link = "/users/"
        else:
            self_link = "/users/{}".format(data['id'])
        return {'self': self_link}

    class Meta:
        type_ = 'users'
