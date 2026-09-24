from django.contrib import admin
from .models import Dispute, DisputeMessage


class DisputeMessageInline(admin.TabularInline):
    model = DisputeMessage
    extra = 0
    readonly_fields = ['created_at']


@admin.register(Dispute)
class DisputeAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'complainant', 'respondent', 'dispute_type', 'status', 'resolved_at', 'created_at']
    list_filter = ['dispute_type', 'status', 'created_at']
    search_fields = ['order__id', 'complainant__username', 'respondent__username']
    inlines = [DisputeMessageInline]
    readonly_fields = ['created_at', 'updated_at']


@admin.register(DisputeMessage)
class DisputeMessageAdmin(admin.ModelAdmin):
    list_display = ['dispute', 'sender', 'message', 'created_at']
    list_filter = ['created_at']
    search_fields = ['dispute__id', 'sender__username', 'message']
