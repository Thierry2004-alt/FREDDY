from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, FarmerProfileViewSet, BuyerProfileViewSet, DeliveryAgentProfileViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'farmers', FarmerProfileViewSet, basename='farmer-profile')
router.register(r'buyers', BuyerProfileViewSet, basename='buyer-profile')
router.register(r'delivery-agents', DeliveryAgentProfileViewSet, basename='delivery-agent-profile')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserViewSet.as_view({'post': 'create'}), name='register'),
]
