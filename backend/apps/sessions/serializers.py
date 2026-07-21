from rest_framework import serializers

class SessionSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    exchange_id = serializers.CharField()
    skill_name = serializers.CharField()
    teacher_email = serializers.EmailField()
    learner_email = serializers.EmailField()
    scheduled_time = serializers.DateTimeField()
    meeting_link = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    mode = serializers.CharField(default="Online")
    status = serializers.CharField(read_only=True)

class ReviewSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    session_id = serializers.CharField()
    reviewee_email = serializers.EmailField()
    rating = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(max_length=1000, required=False, allow_blank=True)
