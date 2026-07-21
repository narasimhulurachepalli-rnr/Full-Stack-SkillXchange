from django.urls import path
from apps.exchanges.views import ExchangeListView, ExchangeActionView

urlpatterns = [
    path('', ExchangeListView.as_view(), name='exchange_list'),
    path('<str:exchange_id>/<str:action>/', ExchangeActionView.as_view(), name='exchange_action'),
]
