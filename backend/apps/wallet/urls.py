from django.urls import path
from apps.wallet.views import (
    WalletView, TransactionListView, CreditTransferView, 
    CreditDeductView, CreditRefundView, AdminWalletView
)

urlpatterns = [
    path('', WalletView.as_view(), name='wallet_details'),
    path('transactions/', TransactionListView.as_view(), name='wallet_transactions'),
    path('transfer/', CreditTransferView.as_view(), name='wallet_transfer'),
    path('deduct/', CreditDeductView.as_view(), name='wallet_deduct'),
    path('refund/', CreditRefundView.as_view(), name='wallet_refund'),
    path('admin/', AdminWalletView.as_view(), name='wallet_admin'),
]
