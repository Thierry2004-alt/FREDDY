from rest_framework import serializers
from .models import Order, OrderItem
from produce.serializers import ProduceSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    produce_name = serializers.CharField(source='produce.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'produce', 'produce_name', 'quantity', 'unit_price', 'total_price']
        read_only_fields = ['id']


class OrderSerializer(serializers.ModelSerializer):
    buyer_name = serializers.CharField(source='buyer.username', read_only=True)
    produce_name = serializers.CharField(source='produce.name', read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'buyer', 'buyer_name', 'produce', 'produce_name', 'quantity', 'unit_price',
                  'total_price', 'delivery_address', 'delivery_notes', 'status', 'delivery_date',
                  'is_pre_order', 'notes', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'buyer', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['produce', 'quantity', 'delivery_address', 'delivery_notes', 'is_pre_order', 'notes']
        read_only_fields = []
