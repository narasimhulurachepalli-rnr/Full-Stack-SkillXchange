from django.urls import path
from apps.skills.views import CategoryListView, SkillListView, UserSearchExploreView

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='skill_categories'),
    path('list/', SkillListView.as_view(), name='skills_list'),
    path('search/', UserSearchExploreView.as_view(), name='user_search'),
]
