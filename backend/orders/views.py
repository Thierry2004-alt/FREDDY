from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderCreateSerializer, OrderItemSerializer
from users.models import User
from delivery.models import Delivery


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'buyer':
            return Order.objects.filter(buyer=user).select_related('buyer', 'produce').prefetch_related('items')
        elif user.role == 'farmer':
            return Order.objects.filter(produce__farmer=user).select_related('buyer', 'produce').prefetch_related('items')
        return Order.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.request.user
        if user.role != 'buyer':
            return Response({'error': 'Only buyers can create orders'}, status=status.HTTP_403_FORBIDDEN)
        produce = serializer.validated_data['produce']
        quantity = serializer.validated_data['quantity']
        unit_price = produce.price_per_unit
        total_price = quantity * unit_price
        order = serializer.save(buyer=user, unit_price=unit_price, total_price=total_price)
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'buyer':
            raise PermissionError("Only buyers can create orders")
        produce = serializer.validated_data['produce']
        quantity = serializer.validated_data['quantity']
        unit_price = produce.price_per_unit
        total_price = quantity * unit_price
        serializer.save(buyer=user, unit_price=unit_price, total_price=total_price)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status not in ['pending', 'confirmed']:
            return Response({'error': 'Order cannot be cancelled'}, status=status.HTTP_400_BAD_REQUEST)
        order.status = 'cancelled'
        order.save()
        return Response({'message': 'Order cancelled successfully'})

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        order = self.get_object()
        if request.user.role != 'farmer':
            return Response({'error': 'Only farmers can confirm orders'}, status=status.HTTP_403_FORBIDDEN)
        if order.produce.farmer != request.user:
            return Response({'error': 'You can only confirm your own orders'}, status=status.HTTP_403_FORBIDDEN)

        order.status = 'confirmed'
        order.save()

        # Assign delivery agent and create Delivery record
        delivery_agent_id = request.data.get('delivery_agent_id')
        if delivery_agent_id:
            try:
                agent = User.objects.get(id=delivery_agent_id, role='delivery')
                pickup = getattr(order.produce, 'location', 'Producteur')
                Delivery.objects.update_or_create(
                    order=order,
                    defaults={
                        'delivery_agent': agent,
                        'pickup_location': pickup,
                        'dropoff_location': order.delivery_address or 'Adresse acheteur',
                        'status': 'assigned',
                    },
                )
            except User.DoesNotExist:
                return Response({'error': 'Delivery agent not found'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Order confirmed', 'order': OrderSerializer(order).data})

    @action(detail=False, methods=['get'])
    def transporters(self, request):
        """Return list of available delivery agents for farmer to pick from."""
        agents = User.objects.filter(role='delivery').values(
            'id', 'username', 'first_name', 'last_name', 'phone_number', 'region'
        )
        return Response(list(agents))
