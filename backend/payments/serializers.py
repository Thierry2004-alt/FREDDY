from rest_framework import serializers
from .models import Payment, PaymentDisbursement


class PaymentSerializer(serializers.ModelSerializer):
    payer_name = serializers.CharField(source='payer.username', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'order', 'payer', 'payer_name', 'amount', 'payment_method', 'status',
                  'transaction_id', 'reference_number', 'phone_number', 'notes', 'paid_at', 'created_at']
        read_only_fields = ['id', 'created_at']


class PaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['order', 'amount', 'payment_method', 'phone_number', 'notes']
        read_only_fields = []


class PaymentDisbursementSerializer(serializers.ModelSerializer):
    recipient_name = serializers.CharField(source='recipient.username', read_only=True)

    class Meta:
        model = PaymentDisbursement
        fields = ['id', 'payment', 'recipient', 'recipient_name', 'amount', 'status',
                  'transaction_id', 'disbursed_at', 'created_at']
        read_only_fields = ['id', 'created_at']
