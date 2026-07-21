from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.sessions.models import Session, Review
from apps.sessions.serializers import SessionSerializer, ReviewSerializer
from apps.exchanges.models import ExchangeRequest
from apps.authentication.models import UserProfile
from datetime import datetime
import mongoengine

class SessionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        email = request.user.email
        sessions = Session.objects(
            mongoengine.Q(teacher_email=email) | mongoengine.Q(learner_email=email)
        ).order_by('-scheduled_time')
        
        results = []
        for s in sessions:
            t_prof = UserProfile.objects(email=s.teacher_email).first()
            l_prof = UserProfile.objects(email=s.learner_email).first()
            results.append(
                s.to_json_dict(
                    teacher_profile=t_prof.to_json_dict() if t_prof else None,
                    learner_profile=l_prof.to_json_dict() if l_prof else None
                )
            )
        return Response(results, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = SessionSerializer(data=request.data)
        if serializer.is_valid():
            # Create session
            session = Session(
                exchange_id=serializer.validated_data['exchange_id'],
                skill_name=serializer.validated_data['skill_name'],
                teacher_email=serializer.validated_data['teacher_email'],
                learner_email=serializer.validated_data['learner_email'],
                scheduled_time=serializer.validated_data['scheduled_time'],
                meeting_link=serializer.validated_data.get('meeting_link', ''),
                notes=serializer.validated_data.get('notes', ''),
                mode=serializer.validated_data.get('mode', 'Online'),
                status="Scheduled"
            )
            session.save()
            
            # Update corresponding exchange request status to "Scheduled"
            ExchangeRequest.objects(id=session.exchange_id).update(status="Scheduled", updated_at=datetime.utcnow())
            
            t_prof = UserProfile.objects(email=session.teacher_email).first()
            l_prof = UserProfile.objects(email=session.learner_email).first()
            return Response(
                session.to_json_dict(
                    teacher_profile=t_prof.to_json_dict() if t_prof else None,
                    learner_profile=l_prof.to_json_dict() if l_prof else None
                ),
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SessionCompleteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        session = Session.objects(id=session_id).first()
        if not session:
            return Response({"error": "Session not found."}, status=status.HTTP_404_NOT_FOUND)
            
        email = request.user.email
        if session.teacher_email != email and session.learner_email != email:
            return Response({"error": "Unauthorized action."}, status=status.HTTP_403_FORBIDDEN)
            
        if session.teacher_email == email:
            session.host_completed = True
        else:
            session.guest_completed = True
            
        # If both parties confirmed, mark completed and distribute points
        if session.host_completed and session.guest_completed:
            session.status = "Completed"
            
            # Increment point counts (e.g. 20 points awarded on both sides for completing exchange)
            UserProfile.objects(email=session.teacher_email).update_one(inc__points=20)
            UserProfile.objects(email=session.learner_email).update_one(inc__points=20)
            
            # Update exchange request status
            ExchangeRequest.objects(id=session.exchange_id).update(status="Completed", updated_at=datetime.utcnow())
            
        session.save()
        
        t_prof = UserProfile.objects(email=session.teacher_email).first()
        l_prof = UserProfile.objects(email=session.learner_email).first()
        return Response(
            session.to_json_dict(
                teacher_profile=t_prof.to_json_dict() if t_prof else None,
                learner_profile=l_prof.to_json_dict() if l_prof else None
            ),
            status=status.HTTP_200_OK
        )

class ReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Retrieve user profile reviews
        email = request.query_params.get('user_email', request.user.email)
        reviews = Review.objects(reviewee_email=email).order_by('-created_at')
        
        results = []
        for r in reviews:
            rev_prof = UserProfile.objects(email=r.reviewer_email).first()
            results.append(
                r.to_json_dict(
                    reviewer_profile=rev_prof.to_json_dict() if rev_prof else None
                )
            )
        return Response(results, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            # Check if review already exists
            existing = Review.objects(session_id=serializer.validated_data['session_id'], reviewer_email=request.user.email).first()
            if existing:
                return Response({"error": "You have already reviewed this session."}, status=status.HTTP_400_BAD_REQUEST)
                
            review = Review(
                session_id=serializer.validated_data['session_id'],
                reviewer_email=request.user.email,
                reviewee_email=serializer.validated_data['reviewee_email'],
                rating=serializer.validated_data['rating'],
                comment=serializer.validated_data.get('comment', '')
            )
            review.save()
            
            # Recalculate average rating of the reviewee
            all_reviews = Review.objects(reviewee_email=review.reviewee_email)
            total_rating = sum(r.rating for r in all_reviews)
            count = all_reviews.count()
            avg = round(total_rating / count, 1) if count > 0 else 5.0
            
            UserProfile.objects(email=review.reviewee_email).update(rating_avg=avg)
            
            rev_prof = UserProfile.objects(email=request.user.email).first()
            return Response(
                review.to_json_dict(
                    reviewer_profile=rev_prof.to_json_dict() if rev_prof else None
                ),
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
