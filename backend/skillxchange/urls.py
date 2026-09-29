from django.urls import path, include
from django.http import JsonResponse
from apps.authentication.views import MongoDBDebugView

def root_view(request):
    return JsonResponse({
        "status": "online",
        "service": "SkillXchange Backend API",
        "frontend_url": "http://localhost:5173",
        "api_endpoints": "/api/",
        "debug_mongodb": "/api/debug/mongodb/"
    })

urlpatterns = [
    path('', root_view, name='root_index'),
    path('api/debug/mongodb/', MongoDBDebugView.as_view(), name='root_mongodb_debug'),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/skills/', include('apps.skills.urls')),
    path('api/exchanges/', include('apps.exchanges.urls')),
    path('api/chat/', include('apps.chat.urls')),
    path('api/sessions/', include('apps.sessions.urls')),
    path('api/wallet/', include('apps.wallet.urls')),
]

