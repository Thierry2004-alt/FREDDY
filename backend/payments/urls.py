from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, PaymentDisbursementViewSet

router = DefaultRouter()
router.register(r'payments', PaymentViewSet, basename='payments')
router.register(r'disbursements', PaymentDisbursementViewSet, basename='disbursement')

urlpatterns = [
    path('', include(router.urls)),
]
