import mongoengine
from datetime import datetime

class Session(mongoengine.Document):
    meta = {
        'collection': 'sessions',
        'indexes': ['teacher_email', 'learner_email', 'status']
    }
    
    exchange_id = mongoengine.StringField(required=True)
    skill_name = mongoengine.StringField(required=True)
    teacher_email = mongoengine.StringField(required=True)
    learner_email = mongoengine.StringField(required=True)
    scheduled_time = mongoengine.DateTimeField(required=True)
    meeting_link = mongoengine.StringField(default="")
    notes = mongoengine.StringField(default="")
    mode = mongoengine.StringField(default="Online")  # "Online" or "Offline"
    status = mongoengine.StringField(default="Scheduled")  # "Scheduled", "Completed", "Cancelled"
    
    # Dual-confirmation parameters
    host_completed = mongoengine.BooleanField(default=False)
    guest_completed = mongoengine.BooleanField(default=False)
    
    created_at = mongoengine.DateTimeField(default=datetime.utcnow)

    def to_json_dict(self, teacher_profile=None, learner_profile=None):
        return {
            'id': str(self.id),
            'exchange_id': self.exchange_id,
            'skill_name': self.skill_name,
            'teacher_email': self.teacher_email,
            'learner_email': self.learner_email,
            'scheduled_time': self.scheduled_time.isoformat() if self.scheduled_time else None,
            'meeting_link': self.meeting_link,
            'notes': self.notes,
            'mode': self.mode,
            'status': self.status,
            'host_completed': self.host_completed,
            'guest_completed': self.guest_completed,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'teacher_profile': teacher_profile,
            'learner_profile': learner_profile
        }

class Review(mongoengine.Document):
    meta = {
        'collection': 'reviews',
        'indexes': ['reviewee_email']
    }
    
    session_id = mongoengine.StringField(required=True)
    reviewer_email = mongoengine.StringField(required=True)
    reviewee_email = mongoengine.StringField(required=True)
    rating = mongoengine.IntField(required=True, min_value=1, max_value=5)
    comment = mongoengine.StringField(default="")
    created_at = mongoengine.DateTimeField(default=datetime.utcnow)

    def to_json_dict(self, reviewer_profile=None):
        return {
            'id': str(self.id),
            'session_id': self.session_id,
            'reviewer_email': self.reviewer_email,
            'reviewee_email': self.reviewee_email,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'reviewer_profile': reviewer_profile
        }
