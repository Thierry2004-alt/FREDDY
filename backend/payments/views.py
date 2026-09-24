from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Payment, PaymentDisbursement
from .serializers import PaymentSerializer, PaymentCreateSerializer, PaymentDisbursementSerializer
from orders.models import Order


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'buyer':
            return Payment.objects.filter(payer=user).select_related('order', 'payer')
        elif user.role == 'farmer':
            return Payment.objects.filter(order__produce__farmer=user).select_related('order', 'payer')
        return Payment.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return PaymentCreateSerializer
        return PaymentSerializer

    def perform_create(self, serializer):
        user = self.request.user
        order = serializer.validated_data['order']
        if order.buyer != user:
            raise PermissionError("You can only pay for your own orders")
        import uuid
        reference_number = f"PAY-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(payer=user, reference_number=reference_number)

    @action(detail=True, methods=['post'])
    def mark_completed(self, request, pk=None):
        payment = self.get_object()
        if request.user.role != 'admin':
            return Response({'error': 'Only admins can mark payments as completed'}, status=status.HTTP_403_FORBIDDEN)
        payment.status = 'completed'
        from django.utils import timezone
        payment.paid_at = timezone.now()
        payment.save()
        return Response({'message': 'Payment marked as completed'})


class PaymentDisbursementViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PaymentDisbursementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'farmer':
            return PaymentDisbursement.objects.filter(recipient=user).select_related('payment', 'recipient')
        return PaymentDisbursement.objects.none()
