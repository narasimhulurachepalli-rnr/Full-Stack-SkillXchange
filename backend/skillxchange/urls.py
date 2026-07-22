from django.urls import path, include
from apps.authentication.views import MongoDBDebugView

urlpatterns = [
    path('api/debug/mongodb/', MongoDBDebugView.as_view(), name='root_mongodb_debug'),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/skills/', include('apps.skills.urls')),
    path('api/exchanges/', include('apps.exchanges.urls')),
    path('api/chat/', include('apps.chat.urls')),
    path('api/sessions/', include('apps.sessions.urls')),
    path('api/wallet/', include('apps.wallet.urls')),
]
