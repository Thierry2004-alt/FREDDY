from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProduceViewSet

router = DefaultRouter()
router.register(r'produce', ProduceViewSet, basename='produce')
router.register(r'products', ProduceViewSet, basename='products')
router.register(r'', ProduceViewSet, basename='produce_direct')

urlpatterns = [
    path('', include(router.urls)),
]

