from django.urls import path, include

urlpatterns = [
    path('api/auth/', include('apps.authentication.urls')),
    path('api/skills/', include('apps.skills.urls')),
    path('api/exchanges/', include('apps.exchanges.urls')),
    path('api/chat/', include('apps.chat.urls')),
    path('api/sessions/', include('apps.sessions.urls')),
    path('api/wallet/', include('apps.wallet.urls')),
]
