from rest_framework import serializers

class CreditTransferSerializer(serializers.Serializer):
    receiver_email = serializers.EmailField(required=True)
    amount = serializers.FloatField(required=True, min_value=0.1)
    reason = serializers.CharField(required=False, allow_blank=True, default="Peer Credit Transfer")

class CreditDeductSerializer(serializers.Serializer):
    amount = serializers.FloatField(required=True, min_value=0.1)
    reason = serializers.CharField(required=False, allow_blank=True, default="Session Booking Fee")
    session_id = serializers.CharField(required=False, allow_blank=True, default="")

class CreditRefundSerializer(serializers.Serializer):
    amount = serializers.FloatField(required=True, min_value=0.1)
    reason = serializers.CharField(required=False, allow_blank=True, default="Cancelled Session Refund")
    transaction_id = serializers.CharField(required=False, allow_blank=True, default="")

class AdminWalletActionSerializer(serializers.Serializer):
    user_email = serializers.EmailField(required=True)
    action = serializers.ChoiceField(choices=['add', 'deduct', 'freeze', 'unfreeze'])
    amount = serializers.FloatField(required=False, default=0.0)
    reason = serializers.CharField(required=False, allow_blank=True, default="Admin Action")
