from django.contrib import admin
from .models import Produce, ProduceImage


@admin.register(Produce)
class ProduceAdmin(admin.ModelAdmin):
    list_display = ['name', 'farmer', 'category', 'quantity_available', 'price_per_unit', 'status', 'is_organic', 'created_at']
    list_filter = ['category', 'status', 'is_organic', 'created_at']
    search_fields = ['name', 'farmer__username', 'location']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(ProduceImage)
class ProduceImageAdmin(admin.ModelAdmin):
    list_display = ['produce', 'uploaded_at']
    list_filter = ['uploaded_at']
    search_fields = ['produce__name']
