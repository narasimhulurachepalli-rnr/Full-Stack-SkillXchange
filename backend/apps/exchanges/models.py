import mongoengine
from datetime import datetime

class ExchangeRequest(mongoengine.Document):
    meta = {
        'collection': 'exchange_requests',
        'indexes': ['sender_email', 'receiver_email', 'status']
    }
    
    sender_email = mongoengine.StringField(required=True)
    receiver_email = mongoengine.StringField(required=True)
    learn_skill = mongoengine.StringField(required=True)
    teach_skill = mongoengine.StringField(required=True)
    message = mongoengine.StringField(default="")
    status = mongoengine.StringField(default="Pending")  # "Pending", "Accepted", "Declined", "Scheduled", "Completed", "Cancelled"
    
    created_at = mongoengine.DateTimeField(default=datetime.utcnow)
    updated_at = mongoengine.DateTimeField(default=datetime.utcnow)

    def to_json_dict(self, sender_profile=None, receiver_profile=None):
        return {
            'id': str(self.id),
            'sender_email': self.sender_email,
            'receiver_email': self.receiver_email,
            'learn_skill': self.learn_skill,
            'teach_skill': self.teach_skill,
            'message': self.message,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'sender_profile': sender_profile,
            'receiver_profile': receiver_profile
        }
