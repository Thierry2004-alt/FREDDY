from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['total_price']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'buyer', 'produce', 'quantity', 'total_price', 'status', 'is_pre_order', 'created_at']
    list_filter = ['status', 'is_pre_order', 'created_at']
    search_fields = ['buyer__username', 'produce__name']
    inlines = [OrderItemInline]
    readonly_fields = ['created_at', 'updated_at']


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'produce', 'quantity', 'unit_price', 'total_price']
    list_filter = ['order__status']
    search_fields = ['produce__name', 'order__buyer__username']
