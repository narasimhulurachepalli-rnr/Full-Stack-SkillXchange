from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from apps.authentication.views import (
    RegisterView, CustomLoginView, ProfileView, PingView, MongoDBDebugView
)

urlpatterns = [
    path('ping/', PingView.as_view(), name='auth_ping'),
    path('debug/mongodb/', MongoDBDebugView.as_view(), name='mongodb_debug'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomLoginView.as_view(), name='auth_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='auth_token_refresh'),
    path('profile/', ProfileView.as_view(), name='auth_profile'),
]
