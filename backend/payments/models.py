from django.db import models
from users.models import User
from orders.models import Order


class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = (
        ('mtn_momo', 'MTN Mobile Money'),
        ('vodafone_cash', 'Vodafone Cash'),
        ('airtel_tigo', 'AirtelTigo Money'),
        ('bank_transfer', 'Bank Transfer'),
        ('cash', 'Cash on Delivery'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    payer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=100, blank=True)
    reference_number = models.CharField(max_length=100, unique=True)
    phone_number = models.CharField(max_length=20, blank=True)
    notes = models.TextField(blank=True)
    paid_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment #{self.id} - {self.reference_number}"


class PaymentDisbursement(models.Model):
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='disbursements')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='disbursements')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=Payment.STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=100, blank=True)
    disbursed_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Disbursement #{self.id} - {self.recipient.username}"
