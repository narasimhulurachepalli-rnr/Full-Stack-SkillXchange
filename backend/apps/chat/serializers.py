from rest_framework import serializers

class ChatMessageSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    receiver_email = serializers.EmailField()
    message = serializers.CharField(max_length=5000)
    created_at = serializers.DateTimeField(read_only=True)
