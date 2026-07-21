import mongoengine
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.wallet.models import Wallet, Transaction
from apps.wallet.serializers import (
    CreditTransferSerializer, CreditDeductSerializer, 
    CreditRefundSerializer, AdminWalletActionSerializer
)
from apps.authentication.models import UserProfile
from datetime import datetime

def get_or_create_wallet(user_email):
    wallet = Wallet.objects(user_email=user_email).first()
    if not wallet:
        wallet = Wallet(
            user_email=user_email,
            balance=1.0,  # Welcome bonus 1 credit
            is_frozen=False
        )
        wallet.save()
        
        # Log Welcome Bonus Transaction
        tx = Transaction(
            wallet_id=str(wallet.id),
            sender_email="System",
            receiver_email=user_email,
            amount=1.0,
            type="Welcome Bonus",
            reason="Welcome Skill Credit Bonus on Account Creation",
            status="Success",
            balance_after=1.0
        )
        tx.save()
    return wallet

class WalletView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        email = request.user.email
        wallet = get_or_create_wallet(email)
        return Response(wallet.to_json_dict(), status=status.HTTP_200_OK)

class TransactionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        email = request.user.email
        wallet = get_or_create_wallet(email)
        
        # Fetch transactions where user is sender or receiver
        txs = Transaction.objects(
            (mongoengine.Q(sender_email=email) | mongoengine.Q(receiver_email=email))
        ).order_by('-created_at')
        
        return Response([tx.to_json_dict() for tx in txs], status=status.HTTP_200_OK)

class CreditTransferView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreditTransferSerializer(data=request.data)
        if serializer.is_valid():
            sender_email = request.user.email
            receiver_email = serializer.validated_data['receiver_email']
            amount = serializer.validated_data['amount']
            reason = serializer.validated_data.get('reason', 'Peer Credit Transfer')

            if sender_email == receiver_email:
                return Response({"error": "You cannot transfer credits to yourself."}, status=status.HTTP_400_BAD_REQUEST)

            # Check receiver exists
            receiver_prof = UserProfile.objects(email=receiver_email).first()
            if not receiver_prof:
                return Response({"error": "Recipient user not found."}, status=status.HTTP_404_NOT_FOUND)

            sender_wallet = get_or_create_wallet(sender_email)
            if sender_wallet.is_frozen:
                return Response({"error": "Your wallet is currently frozen. Contact support."}, status=status.HTTP_403_FORBIDDEN)

            if sender_wallet.balance < amount:
                return Response({"error": f"Insufficient wallet balance. You have {sender_wallet.balance} Credits available."}, status=status.HTTP_400_BAD_REQUEST)

            receiver_wallet = get_or_create_wallet(receiver_email)

            # Atomic transaction simulation
            sender_wallet.balance -= amount
            sender_wallet.updated_at = datetime.utcnow()
            sender_wallet.save()

            receiver_wallet.balance += amount
            receiver_wallet.updated_at = datetime.utcnow()
            receiver_wallet.save()

            # Record Sender Debit
            sender_tx = Transaction(
                wallet_id=str(sender_wallet.id),
                sender_email=sender_email,
                receiver_email=receiver_email,
                amount=amount,
                type="Transfer Out",
                reason=reason,
                status="Success",
                balance_after=sender_wallet.balance
            )
            sender_tx.save()

            # Record Receiver Credit
            receiver_tx = Transaction(
                wallet_id=str(receiver_wallet.id),
                sender_email=sender_email,
                receiver_email=receiver_email,
                amount=amount,
                type="Transfer In",
                reason=reason,
                status="Success",
                balance_after=receiver_wallet.balance
            )
            receiver_tx.save()

            return Response({
                "message": f"Successfully transferred {amount} Skill Credit(s) to {receiver_email}.",
                "wallet": sender_wallet.to_json_dict(),
                "transaction": sender_tx.to_json_dict()
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreditDeductView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreditDeductSerializer(data=request.data)
        if serializer.is_valid():
            email = request.user.email
            amount = serializer.validated_data['amount']
            reason = serializer.validated_data.get('reason', 'Session Booking Fee')

            wallet = get_or_create_wallet(email)
            if wallet.is_frozen:
                return Response({"error": "Your wallet is frozen."}, status=status.HTTP_403_FORBIDDEN)

            if wallet.balance < amount:
                return Response({"error": f"Insufficient credits. You need {amount} credit(s)."}, status=status.HTTP_400_BAD_REQUEST)

            wallet.balance -= amount
            wallet.updated_at = datetime.utcnow()
            wallet.save()

            tx = Transaction(
                wallet_id=str(wallet.id),
                sender_email=email,
                receiver_email="System",
                amount=amount,
                type="Debit",
                reason=reason,
                status="Success",
                balance_after=wallet.balance
            )
            tx.save()

            return Response({
                "message": f"Deducted {amount} credit(s).",
                "wallet": wallet.to_json_dict(),
                "transaction": tx.to_json_dict()
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreditRefundView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreditRefundSerializer(data=request.data)
        if serializer.is_valid():
            email = request.user.email
            amount = serializer.validated_data['amount']
            reason = serializer.validated_data.get('reason', 'Cancelled Session Refund')

            wallet = get_or_create_wallet(email)
            wallet.balance += amount
            wallet.updated_at = datetime.utcnow()
            wallet.save()

            tx = Transaction(
                wallet_id=str(wallet.id),
                sender_email="System",
                receiver_email=email,
                amount=amount,
                type="Refund",
                reason=reason,
                status="Success",
                balance_after=wallet.balance
            )
            tx.save()

            return Response({
                "message": f"Refunded {amount} credit(s) to your wallet.",
                "wallet": wallet.to_json_dict(),
                "transaction": tx.to_json_dict()
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminWalletView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallets = Wallet.objects.all()
        results = []
        for w in wallets:
            prof = UserProfile.objects(email=w.user_email).first()
            data = w.to_json_dict()
            data['full_name'] = prof.full_name if prof else w.user_email
            data['avatar'] = prof.avatar if prof else ""
            results.append(data)
        return Response(results, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = AdminWalletActionSerializer(data=request.data)
        if serializer.is_valid():
            target_email = serializer.validated_data['user_email']
            action = serializer.validated_data['action']
            amount = serializer.validated_data.get('amount', 0.0)
            reason = serializer.validated_data.get('reason', 'Admin Action')

            wallet = get_or_create_wallet(target_email)

            if action == 'add':
                wallet.balance += amount
                tx_type = "Admin Credit"
            elif action == 'deduct':
                wallet.balance = max(0.0, wallet.balance - amount)
                tx_type = "Admin Debit"
            elif action == 'freeze':
                wallet.is_frozen = True
                tx_type = "Account Freeze"
            elif action == 'unfreeze':
                wallet.is_frozen = False
                tx_type = "Account Unfreeze"

            wallet.updated_at = datetime.utcnow()
            wallet.save()

            if amount > 0 or action in ['freeze', 'unfreeze']:
                tx = Transaction(
                    wallet_id=str(wallet.id),
                    sender_email="Admin",
                    receiver_email=target_email,
                    amount=amount,
                    type=tx_type,
                    reason=reason,
                    status="Success",
                    balance_after=wallet.balance
                )
                tx.save()

            return Response({
                "message": f"Successfully performed action '{action}' on wallet for {target_email}.",
                "wallet": wallet.to_json_dict()
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
