from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Produce, ProduceImage
from .serializers import ProduceSerializer, ProduceCreateSerializer, ProduceImageSerializer
from users.models import User


class ProduceViewSet(viewsets.ModelViewSet):
    queryset = Produce.objects.filter(status='available').select_related('farmer').prefetch_related('images')

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'search']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProduceCreateSerializer
        return ProduceSerializer

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'farmer':
            raise PermissionError("Only farmers can create product listings")
        serializer.save(farmer=user)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_listings(self, request):
        if request.user.role != 'farmer':
            return Response({'error': 'Only farmers can access this endpoint'}, status=status.HTTP_403_FORBIDDEN)
        produces = Produce.objects.filter(farmer=request.user).select_related('farmer').prefetch_related('images')
        serializer = ProduceSerializer(produces, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def search(self, request):
        queryset = Produce.objects.filter(status='available')
        category = request.query_params.get('category')
        region = request.query_params.get('region')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')

        if category:
            queryset = queryset.filter(category=category)
        if region:
            queryset = queryset.filter(farmer__region__icontains=region)
        if min_price:
            queryset = queryset.filter(price_per_unit__gte=min_price)
        if max_price:
            queryset = queryset.filter(price_per_unit__lte=max_price)

        serializer = ProduceSerializer(queryset, many=True)
        return Response(serializer.data)
