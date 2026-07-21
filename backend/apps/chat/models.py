import mongoengine
from datetime import datetime

class ChatMessage(mongoengine.Document):
    meta = {
        'collection': 'chat_messages',
        'indexes': ['sender_email', 'receiver_email', 'created_at']
    }
    
    sender_email = mongoengine.StringField(required=True)
    receiver_email = mongoengine.StringField(required=True)
    message = mongoengine.StringField(required=True)
    is_read = mongoengine.BooleanField(default=False)
    created_at = mongoengine.DateTimeField(default=datetime.utcnow)

    def to_json_dict(self):
        return {
            'id': str(self.id),
            'sender_email': self.sender_email,
            'receiver_email': self.receiver_email,
            'message': self.message,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
