import mongoengine
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.exchanges.models import ExchangeRequest
from apps.exchanges.serializers import ExchangeRequestSerializer
from apps.authentication.models import UserProfile
from datetime import datetime

class ExchangeListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        email = request.user.email
        # Fetch requests where user is either sender or receiver
        requests = ExchangeRequest.objects(
            mongoengine.Q(sender_email=email) | mongoengine.Q(receiver_email=email)
        ).order_by('-created_at')
        
        results = []
        for req in requests:
            sender_prof = UserProfile.objects(email=req.sender_email).first()
            receiver_prof = UserProfile.objects(email=req.receiver_email).first()
            results.append(
                req.to_json_dict(
                    sender_profile=sender_prof.to_json_dict() if sender_prof else None,
                    receiver_profile=receiver_prof.to_json_dict() if receiver_prof else None
                )
            )
        return Response(results, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ExchangeRequestSerializer(data=request.data)
        if serializer.is_valid():
            receiver_email = serializer.validated_data['receiver_email']
            
            # Check if self
            if receiver_email == request.user.email:
                return Response({"error": "You cannot propose an exchange to yourself."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate receiver exists
            receiver_prof = UserProfile.objects(email=receiver_email).first()
            if not receiver_prof:
                return Response({"error": "Recipient user profile not found."}, status=status.HTTP_404_NOT_FOUND)
            
            exchange = ExchangeRequest(
                sender_email=request.user.email,
                receiver_email=receiver_email,
                learn_skill=serializer.validated_data['learn_skill'],
                teach_skill=serializer.validated_data['teach_skill'],
                message=serializer.validated_data.get('message', ''),
                status="Pending"
            )
            exchange.save()
            
            sender_prof = UserProfile.objects(email=request.user.email).first()
            return Response(
                exchange.to_json_dict(
                    sender_profile=sender_prof.to_json_dict() if sender_prof else None,
                    receiver_profile=receiver_prof.to_json_dict() if receiver_prof else None
                ),
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ExchangeActionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, exchange_id, action):
        exchange = ExchangeRequest.objects(id=exchange_id).first()
        if not exchange:
            return Response({"error": "Exchange request not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Check permissions: only receiver can accept/decline
        if exchange.receiver_email != request.user.email:
            return Response({"error": "Unauthorized action."}, status=status.HTTP_403_FORBIDDEN)
            
        if action == 'accept':
            exchange.status = 'Accepted'
        elif action == 'decline':
            exchange.status = 'Declined'
        else:
            return Response({"error": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)
            
        exchange.updated_at = datetime.utcnow()
        exchange.save()
        
        sender_prof = UserProfile.objects(email=exchange.sender_email).first()
        receiver_prof = UserProfile.objects(email=exchange.receiver_email).first()
        return Response(
            exchange.to_json_dict(
                sender_profile=sender_prof.to_json_dict() if sender_prof else None,
                receiver_profile=receiver_prof.to_json_dict() if receiver_prof else None
            ),
            status=status.HTTP_200_OK
        )
