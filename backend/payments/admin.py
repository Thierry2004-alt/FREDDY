from django.contrib import admin
from .models import Payment, PaymentDisbursement


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'reference_number', 'payer', 'amount', 'payment_method', 'status', 'paid_at', 'created_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['reference_number', 'payer__username', 'transaction_id']
    readonly_fields = ['created_at']


@admin.register(PaymentDisbursement)
class PaymentDisbursementAdmin(admin.ModelAdmin):
    list_display = ['id', 'payment', 'recipient', 'amount', 'status', 'disbursed_at']
    list_filter = ['status', 'disbursed_at']
    search_fields = ['payment__reference_number', 'recipient__username']
    readonly_fields = ['created_at']
