from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import Delivery, DeliveryStatusUpdate
from .serializers import DeliverySerializer, DeliveryCreateSerializer, DeliveryStatusUpdateSerializer
from users.models import User
from orders.models import Order


def _release_payment_to_farmer(order):
    """
    Escrow release: when delivery is confirmed, mark order delivered and
    trigger payment disbursement to the farmer.
    """
    try:
        order.status = 'delivered'
        order.save()

        # Try to find and complete the associated payment
        from payments.models import Payment, PaymentDisbursement
        try:
            payment = order.payment
            if payment.status != 'completed':
                payment.status = 'completed'
                payment.paid_at = timezone.now()
                payment.save()

            # Create disbursement record to farmer
            farmer = order.produce.farmer
            PaymentDisbursement.objects.get_or_create(
                payment=payment,
                recipient=farmer,
                defaults={
                    'amount': order.total_price,
                    'status': 'completed',
                    'disbursed_at': timezone.now(),
                }
            )
        except Exception:
            # Payment may not exist yet (COD) — still mark order delivered
            pass
    except Exception:
        pass


class DeliveryViewSet(viewsets.ModelViewSet):
    serializer_class = DeliverySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ('admin',) or user.is_staff or user.is_superuser:
            return Delivery.objects.all().select_related('order', 'delivery_agent').order_by('-created_at')
        elif user.role == 'delivery':
            return Delivery.objects.filter(delivery_agent=user).select_related('order', 'delivery_agent').order_by('-created_at')
        elif user.role == 'farmer':
            return Delivery.objects.filter(order__produce__farmer=user).select_related('order', 'delivery_agent').order_by('-created_at')
        elif user.role == 'buyer':
            return Delivery.objects.filter(order__buyer=user).select_related('order', 'delivery_agent').order_by('-created_at')
        return Delivery.objects.none()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return DeliveryCreateSerializer
        return DeliverySerializer

    def perform_create(self, serializer):
        if self.request.user.role != 'delivery':
            raise PermissionError("Only delivery agents can create deliveries")
        serializer.save(delivery_agent=self.request.user)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        delivery = self.get_object()

        # Allow farmer or assigned delivery agent to update status
        user = request.user
        if user.role == 'delivery' and delivery.delivery_agent != user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        if user.role not in ('delivery', 'farmer', 'admin'):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get('status')
        location = request.data.get('location', '')
        notes = request.data.get('notes', '')

        if new_status not in dict(Delivery.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        delivery.status = new_status
        if location:
            delivery.current_location = location
        if new_status == 'picked_up' and not delivery.pickup_time:
            delivery.pickup_time = timezone.now()
        if new_status == 'delivered':
            delivery.delivery_time = timezone.now()
        delivery.save()

        DeliveryStatusUpdate.objects.create(
            delivery=delivery,
            status=new_status,
            location=location,
            notes=notes,
        )

        # 💰 ESCROW RELEASE: auto-disburse payment to farmer on delivery
        if new_status == 'delivered':
            _release_payment_to_farmer(delivery.order)
            return Response({
                'message': 'Livraison confirmée ! Paiement libéré au producteur.',
                'payment_released': True,
            })

        return Response({'message': 'Status updated successfully'})
