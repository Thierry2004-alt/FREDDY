from rest_framework import serializers
from rest_framework.authtoken.models import Token
from .models import User, FarmerProfile, BuyerProfile, DeliveryAgentProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone_number', 'region', 'created_at']
        read_only_fields = ['id', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    phone_number = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    region = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    license_number = serializers.CharField(required=False, allow_blank=True, allow_null=True, write_only=True)
    vehicle_type = serializers.CharField(required=False, allow_blank=True, allow_null=True, write_only=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'role', 'phone_number', 'region',
            'license_number', 'vehicle_type'
        ]

    def validate_role(self, value):
        if not value:
            return 'buyer'
        clean = value.lower().strip()
        if clean == 'admin':
            raise serializers.ValidationError("Cannot register as an administrator. Admin accounts must be granted by the system.")
        if clean not in ['farmer', 'buyer', 'delivery']:
            raise serializers.ValidationError("Role must be farmer, buyer, or delivery.")
        return clean

    def validate(self, data):
        p1 = data.get('password')
        p2 = data.get('password_confirm')
        if p1 != p2:
            raise serializers.ValidationError({"password_confirm": "Les mots de passe ne correspondent pas."})

        if data.get('role') == 'delivery':
            license_val = (data.get('license_number') or '').strip()
            if not license_val:
                raise serializers.ValidationError({
                    "license_number": "Le numéro de permis de conduire (ou CNI) est requis pour les transporteurs."
                })
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        license_num = validated_data.pop('license_number', '') or ''
        v_type = validated_data.pop('vehicle_type', '') or ''

        # Ensure strings for optional fields
        if not validated_data.get('email'):
            validated_data['email'] = ''
        if not validated_data.get('phone_number'):
            validated_data['phone_number'] = ''
        if not validated_data.get('region'):
            validated_data['region'] = ''

        user = User.objects.create_user(**validated_data)
        Token.objects.get_or_create(user=user)

        if user.role == 'delivery':
            DeliveryAgentProfile.objects.create(
                user=user,
                vehicle_type=v_type or 'Camionnette Frigorifique',
                license_number=license_num,
                current_location=user.region or 'Douala'
            )
        elif user.role == 'farmer':
            FarmerProfile.objects.create(
                user=user,
                farm_name=f"Exploitation {user.username}",
                farm_location=user.region or 'Cameroun'
            )
        elif user.role == 'buyer':
            BuyerProfile.objects.create(
                user=user,
                business_name=f"Établissement {user.username}",
                business_type='restaurant',
                address=user.region or 'Douala'
            )

        return user


class FarmerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmerProfile
        fields = '__all__'
        read_only_fields = ['user']


class BuyerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerProfile
        fields = '__all__'
        read_only_fields = ['user']


class DeliveryAgentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryAgentProfile
        fields = '__all__'
        read_only_fields = ['user']
