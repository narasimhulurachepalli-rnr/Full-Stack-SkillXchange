from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from apps.skills.models import Category, Skill
from apps.skills.serializers import CategorySerializer, SkillSerializer
from apps.authentication.models import UserProfile
import mongoengine

class CategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.all()
        return Response([c.to_json_dict() for c in categories], status=status.HTTP_200_OK)

    def post(self, request):
        # Admin check can be added
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            cat = Category(
                name=serializer.validated_data['name'],
                description=serializer.validated_data.get('description', '')
            )
            cat.save()
            return Response(cat.to_json_dict(), status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SkillListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        skills = Skill.objects.all()
        return Response([s.to_json_dict() for s in skills], status=status.HTTP_200_OK)

    def post(self, request):
        serializer = SkillSerializer(data=request.data)
        if serializer.is_valid():
            skill = Skill(
                name=serializer.validated_data['name'],
                category_name=serializer.validated_data['category_name'],
                description=serializer.validated_data.get('description', '')
            )
            skill.save()
            return Response(skill.to_json_dict(), status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserSearchExploreView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        search_query = request.query_params.get('search', '').strip()
        skill_type = request.query_params.get('type', '')  # 'teach' or 'learn'
        major_filter = request.query_params.get('major', '').strip()
        min_rating = request.query_params.get('rating', '')

        # Build mongoengine filter
        query_dict = {}
        if major_filter:
            query_dict['major__icontains'] = major_filter
        
        if min_rating:
            try:
                query_dict['rating_avg__gte'] = float(min_rating)
            except ValueError:
                pass
        
        # Exclude self from search results
        profiles = UserProfile.objects(email__ne=request.user.email, **query_dict)
        
        # Filter profiles by skill keyword using python search if query is specified
        if search_query:
            filtered_profiles = []
            q_lower = search_query.lower()
            for p in profiles:
                # check if name matches or skills contain keyword
                name_match = q_lower in p.full_name.lower()
                teach_match = any(q_lower in skill.lower() for skill in p.teach_skills)
                learn_match = any(q_lower in skill.lower() for skill in p.learn_skills)
                
                if skill_type == 'teach' and teach_match:
                    filtered_profiles.append(p)
                elif skill_type == 'learn' and learn_match:
                    filtered_profiles.append(p)
                elif not skill_type and (name_match or teach_match or learn_match):
                    filtered_profiles.append(p)
            profiles = filtered_profiles

        return Response([p.to_json_dict() for p in profiles], status=status.HTTP_200_OK)
