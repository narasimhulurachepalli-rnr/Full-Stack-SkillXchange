from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.authentication.views import RegisterView, ProfileView, PingView

urlpatterns = [
    path('ping/', PingView.as_view(), name='auth_ping'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', TokenObtainPairView.as_view(), name='auth_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='auth_token_refresh'),
    path('profile/', ProfileView.as_view(), name='auth_profile'),
]
