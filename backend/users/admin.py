from django.contrib import admin
from .models import User, FarmerProfile, BuyerProfile, DeliveryAgentProfile


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'phone_number', 'region', 'is_active']
    list_filter = ['role', 'is_active', 'created_at']
    search_fields = ['username', 'email', 'phone_number']


@admin.register(FarmerProfile)
class FarmerProfileAdmin(admin.ModelAdmin):
    list_display = ['farm_name', 'user', 'farm_location', 'is_verified']
    list_filter = ['is_verified', 'created_at']
    search_fields = ['farm_name', 'farm_location']


@admin.register(BuyerProfile)
class BuyerProfileAdmin(admin.ModelAdmin):
    list_display = ['business_name', 'user', 'business_type', 'is_verified']
    list_filter = ['business_type', 'is_verified', 'created_at']
    search_fields = ['business_name', 'address']


@admin.register(DeliveryAgentProfile)
class DeliveryAgentProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'vehicle_type', 'license_number', 'is_available', 'is_verified']
    list_filter = ['vehicle_type', 'is_available', 'is_verified']
    search_fields = ['user__username', 'license_number']
