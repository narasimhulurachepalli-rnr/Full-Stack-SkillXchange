import mongoengine
from datetime import datetime

class UserProfile(mongoengine.Document):
    meta = {
        'collection': 'user_profiles',
        'indexes': ['email']
    }
    
    email = mongoengine.StringField(required=True, unique=True)
    full_name = mongoengine.StringField(required=True)
    bio = mongoengine.StringField(default="")
    phone = mongoengine.StringField(default="")
    major = mongoengine.StringField(default="")
    
    # Lists of skill names (or IDs)
    teach_skills = mongoengine.ListField(mongoengine.StringField(), default=list)
    learn_skills = mongoengine.ListField(mongoengine.StringField(), default=list)
    
    rating_avg = mongoengine.FloatField(default=5.0)
    points = mongoengine.IntField(default=100)
    credits = mongoengine.IntField(default=1)  # 1 Welcome Credit assigned upon registration
    credit_history = mongoengine.ListField(mongoengine.DictField(), default=list)
    avatar = mongoengine.StringField(default="")
    role = mongoengine.StringField(default="User")  # "User" or "Admin"
    
    is_verified = mongoengine.BooleanField(default=True)
    created_at = mongoengine.DateTimeField(default=datetime.utcnow)

    def to_json_dict(self):
        return {
            'id': str(self.id),
            'email': self.email,
            'full_name': self.full_name,
            'bio': self.bio,
            'phone': self.phone,
            'major': self.major,
            'teach_skills': self.teach_skills,
            'learn_skills': self.learn_skills,
            'rating_avg': self.rating_avg,
            'points': self.points,
            'credits': self.credits,
            'credit_history': self.credit_history,
            'avatar': self.avatar,
            'role': self.role,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
