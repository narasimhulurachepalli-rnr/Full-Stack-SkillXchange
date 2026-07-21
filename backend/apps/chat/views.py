from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.chat.models import ChatMessage
from apps.chat.serializers import ChatMessageSerializer
from apps.authentication.models import UserProfile
import mongoengine
from datetime import datetime

class ChatMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        partner_email = request.query_params.get('partner', '')
        if not partner_email:
            return Response({"error": "Partner email query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        email = request.user.email
        
        # Mark incoming messages from partner as read
        ChatMessage.objects(sender_email=partner_email, receiver_email=email, is_read=False).update(is_read=True)
        
        # Query messages between both users
        messages = ChatMessage.objects(
            (mongoengine.Q(sender_email=email) & mongoengine.Q(receiver_email=partner_email)) |
            (mongoengine.Q(sender_email=partner_email) & mongoengine.Q(receiver_email=email))
        ).order_by('created_at')
        
        return Response([m.to_json_dict() for m in messages], status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ChatMessageSerializer(data=request.data)
        if serializer.is_valid():
            receiver_email = serializer.validated_data['receiver_email']
            
            # Check self message
            if receiver_email == request.user.email:
                return Response({"error": "You cannot message yourself."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Save message
            msg = ChatMessage(
                sender_email=request.user.email,
                receiver_email=receiver_email,
                message=serializer.validated_data['message']
            )
            msg.save()
            return Response(msg.to_json_dict(), status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChatRoomsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        email = request.user.email
        
        # Find all unique emails the user has chatted with
        sent_emails = ChatMessage.objects(sender_email=email).distinct('receiver_email')
        received_emails = ChatMessage.objects(receiver_email=email).distinct('sender_email')
        partner_emails = list(set(sent_emails + received_emails))
        
        rooms = []
        for p_email in partner_emails:
            profile = UserProfile.objects(email=p_email).first()
            if not profile:
                continue
            
            # Fetch last message
            last_msg = ChatMessage.objects(
                (mongoengine.Q(sender_email=email) & mongoengine.Q(receiver_email=p_email)) |
                (mongoengine.Q(sender_email=p_email) & mongoengine.Q(receiver_email=email))
            ).order_by('-created_at').first()
            
            # Count unread
            unread_count = ChatMessage.objects(sender_email=p_email, receiver_email=email, is_read=False).count()
            
            rooms.append({
                'profile': profile.to_json_dict(),
                'unread_count': unread_count,
                'last_message': last_msg.to_json_dict() if last_msg else None
            })
            
        # Sort rooms by last message time descending
        rooms.sort(key=lambda x: x['last_message']['created_at'] if x['last_message'] else '', reverse=True)
        return Response(rooms, status=status.HTTP_200_OK)
