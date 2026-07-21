import mongoengine
from datetime import datetime

class Category(mongoengine.Document):
    meta = {
        'collection': 'categories'
    }
    name = mongoengine.StringField(required=True, unique=True)
    description = mongoengine.StringField(default="")

    def to_json_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'description': self.description
        }

class Skill(mongoengine.Document):
    meta = {
        'collection': 'skills'
    }
    name = mongoengine.StringField(required=True, unique=True)
    category_name = mongoengine.StringField(required=True)  # Category name reference
    description = mongoengine.StringField(default="")

    def to_json_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'category_name': self.category_name,
            'description': self.description
        }
