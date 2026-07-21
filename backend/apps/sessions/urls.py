from django.urls import path
from apps.sessions.views import SessionView, SessionCompleteView, ReviewView

urlpatterns = [
    path('', SessionView.as_view(), name='session_list'),
    path('<str:session_id>/complete/', SessionCompleteView.as_view(), name='session_complete'),
    path('reviews/', ReviewView.as_view(), name='reviews_list'),
]
