from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from .models import User, FarmerProfile, BuyerProfile, DeliveryAgentProfile
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    FarmerProfileSerializer,
    BuyerProfileSerializer,
    DeliveryAgentProfileSerializer,
)


class CustomAuthToken(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username_or_email = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        if not username_or_email or not password:
            return Response(
                {'error': 'Veuillez saisir votre nom d\'utilisateur et mot de passe.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Case-insensitive lookup by username or email
        user = User.objects.filter(username__iexact=username_or_email).first()
        if not user:
            user = User.objects.filter(email__iexact=username_or_email).first()

        if user and user.check_password(password):
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data,
            }, status=status.HTTP_200_OK)

        return Response(
            {'error': 'Nom d\'utilisateur ou mot de passe incorrect.'},
            status=status.HTTP_400_BAD_REQUEST
        )



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['role', 'is_active', 'region']

    def get_permissions(self):
        if self.action in ['create', 'stats']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'create':
            return RegisterSerializer
        return UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        user_data = UserSerializer(user).data
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                'token': token.key,
                'user': user_data,
                'message': 'Account created successfully',
            },
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        from orders.models import Order
        from produce.models import Produce
        from delivery.models import Delivery
        from disputes.models import Dispute
        from django.db.models import Sum

        total_users = User.objects.count()
        total_farmers = User.objects.filter(role='farmer').count()
        total_buyers = User.objects.filter(role='buyer').count()
        total_deliveries = Delivery.objects.count()
        total_orders = Order.objects.count()
        total_disputes = Dispute.objects.count()
        escrow_sum = Order.objects.aggregate(total=Sum('total_price'))['total'] or 0

        return Response({
            'total_users': total_users,
            'total_farmers': total_farmers,
            'total_buyers': total_buyers,
            'total_deliveries': total_deliveries,
            'total_orders': total_orders,
            'total_disputes': total_disputes,
            'escrow_volume': float(escrow_sum),
        })

    @action(detail=False, methods=['put', 'patch'])
    def update_me(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class FarmerProfileViewSet(viewsets.ModelViewSet):
    serializer_class = FarmerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'farmer':
            return FarmerProfile.objects.filter(user=self.request.user)
        return FarmerProfile.objects.none()


class BuyerProfileViewSet(viewsets.ModelViewSet):
    serializer_class = BuyerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'buyer':
            return BuyerProfile.objects.filter(user=self.request.user)
        return BuyerProfile.objects.none()


class DeliveryAgentProfileViewSet(viewsets.ModelViewSet):
    serializer_class = DeliveryAgentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'delivery':
            return DeliveryAgentProfile.objects.filter(user=self.request.user)
        return DeliveryAgentProfile.objects.none()
