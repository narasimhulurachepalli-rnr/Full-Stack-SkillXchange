import mongoengine
from datetime import datetime

class Wallet(mongoengine.Document):
    meta = {
        'collection': 'wallets',
        'indexes': ['user_email', 'is_frozen']
    }

    user_email = mongoengine.StringField(required=True, unique=True)
    balance = mongoengine.FloatField(default=1.0)  # 1 Free Welcome Skill Credit on registration
    is_frozen = mongoengine.BooleanField(default=False)
    created_at = mongoengine.DateTimeField(default=datetime.utcnow)
    updated_at = mongoengine.DateTimeField(default=datetime.utcnow)

    def to_json_dict(self):
        return {
            'wallet_id': str(self.id),
            'user_email': self.user_email,
            'balance': round(self.balance, 2),
            'is_frozen': self.is_frozen,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Transaction(mongoengine.Document):
    meta = {
        'collection': 'transactions',
        'indexes': ['wallet_id', 'sender_email', 'receiver_email', 'type', 'status']
    }

    wallet_id = mongoengine.StringField(required=True)
    sender_email = mongoengine.StringField(required=True)
    receiver_email = mongoengine.StringField(required=True)
    amount = mongoengine.FloatField(required=True)
    type = mongoengine.StringField(required=True)  # "Credit", "Debit", "Transfer", "Refund", "Welcome Bonus", "Admin Action"
    reason = mongoengine.StringField(default="")
    status = mongoengine.StringField(default="Success")  # "Success", "Pending", "Failed"
    balance_after = mongoengine.FloatField(default=0.0)
    payment_gateway_provider = mongoengine.StringField(default="")  # Future gateway (Razorpay/Stripe/UPI)
    payment_gateway_ref = mongoengine.StringField(default="")
    created_at = mongoengine.DateTimeField(default=datetime.utcnow)

    def to_json_dict(self):
        return {
            'transaction_id': str(self.id),
            'wallet_id': self.wallet_id,
            'sender_email': self.sender_email,
            'receiver_email': self.receiver_email,
            'amount': round(self.amount, 2),
            'type': self.type,
            'reason': self.reason,
            'status': self.status,
            'balance_after': round(self.balance_after, 2),
            'payment_gateway_provider': self.payment_gateway_provider,
            'payment_gateway_ref': self.payment_gateway_ref,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
