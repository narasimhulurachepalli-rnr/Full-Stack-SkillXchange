from rest_framework import serializers

class ExchangeRequestSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    receiver_email = serializers.EmailField()
    learn_skill = serializers.CharField(max_length=150)
    teach_skill = serializers.CharField(max_length=150)
    message = serializers.CharField(max_length=1000, required=False, allow_blank=True)
    status = serializers.CharField(read_only=True)
