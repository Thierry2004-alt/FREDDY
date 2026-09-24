from rest_framework import serializers
from .models import Delivery, DeliveryStatusUpdate


class DeliveryStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryStatusUpdate
        fields = ['id', 'status', 'location', 'notes', 'timestamp']
        read_only_fields = ['id', 'timestamp']


class DeliverySerializer(serializers.ModelSerializer):
    agent_name = serializers.CharField(source='delivery_agent.username', read_only=True)
    status_updates = DeliveryStatusUpdateSerializer(many=True, read_only=True)
    order_details = serializers.SerializerMethodField()

    class Meta:
        model = Delivery
        fields = ['id', 'order', 'order_details', 'delivery_agent', 'agent_name', 'pickup_location',
                  'dropoff_location', 'current_location', 'status', 'pickup_time', 'delivery_time',
                  'notes', 'status_updates', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_order_details(self, obj):
        order = obj.order
        if not order:
            return None
        return {
            'id': order.id,
            'buyer': order.buyer.username if order.buyer else '',
            'buyer_phone': order.buyer.phone_number if order.buyer else '',
            'buyer_name': f"{order.buyer.first_name} {order.buyer.last_name}".strip() or (order.buyer.username if order.buyer else ''),
            'produce': order.produce.name if order.produce else '',
            'quantity': float(order.quantity),
            'unit': order.produce.unit if order.produce else '',
            'delivery_address': order.delivery_address,
            'farmer': order.produce.farmer.username if order.produce and order.produce.farmer else '',
            'farmer_phone': order.produce.farmer.phone_number if order.produce and order.produce.farmer else '',
            'farmer_location': order.produce.location if order.produce else '',
        }


class DeliveryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = ['order', 'pickup_location', 'dropoff_location', 'notes']
        read_only_fields = []
