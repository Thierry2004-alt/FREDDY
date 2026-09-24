from django.contrib import admin
from django.urls import path, include
from users.views import CustomAuthToken

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/auth/token/', CustomAuthToken.as_view(), name='api_token_auth'),
    path('api/auth/login/', CustomAuthToken.as_view(), name='api_login'),
    path('api/produce/', include('produce.urls')),
    path('api/products/', include('produce.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/delivery/', include('delivery.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/disputes/', include('disputes.urls')),
]
