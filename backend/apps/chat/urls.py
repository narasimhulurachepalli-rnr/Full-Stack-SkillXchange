from django.urls import path
from apps.chat.views import ChatMessageView, ChatRoomsView

urlpatterns = [
    path('messages/', ChatMessageView.as_view(), name='chat_messages'),
    path('rooms/', ChatRoomsView.as_view(), name='chat_rooms'),
]
