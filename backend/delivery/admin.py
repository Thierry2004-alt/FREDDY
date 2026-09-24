from django.contrib import admin
from .models import Delivery, DeliveryStatusUpdate


class DeliveryStatusUpdateInline(admin.TabularInline):
    model = DeliveryStatusUpdate
    extra = 0
    readonly_fields = ['timestamp']


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'delivery_agent', 'status', 'pickup_time', 'delivery_time', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order__id', 'delivery_agent__username']
    inlines = [DeliveryStatusUpdateInline]
    readonly_fields = ['created_at', 'updated_at']


@admin.register(DeliveryStatusUpdate)
class DeliveryStatusUpdateAdmin(admin.ModelAdmin):
    list_display = ['delivery', 'status', 'location', 'timestamp']
    list_filter = ['status', 'timestamp']
    search_fields = ['delivery__id']
