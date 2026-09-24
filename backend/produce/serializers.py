from rest_framework import serializers
from .models import Produce, ProduceImage


class ProduceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProduceImage
        fields = ['id', 'image']
        read_only_fields = ['id']


class ProduceSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.username', read_only=True)
    images = ProduceImageSerializer(many=True, read_only=True)

    class Meta:
        model = Produce
        fields = ['id', 'farmer', 'farmer_name', 'name', 'category', 'description', 'quantity_available',
                  'unit', 'price_per_unit', 'harvest_date', 'expiry_date', 'location', 'status',
                  'is_organic', 'images', 'created_at', 'updated_at']
        read_only_fields = ['id', 'farmer', 'created_at', 'updated_at']


class ProduceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produce
        fields = ['name', 'category', 'description', 'quantity_available', 'unit', 'price_per_unit',
                  'harvest_date', 'expiry_date', 'location', 'is_organic']
        read_only_fields = []
