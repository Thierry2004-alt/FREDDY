from django.db import models
from users.models import User
from orders.models import Order


class Dispute(models.Model):
    DISPUTE_TYPE_CHOICES = (
        ('quality', 'Quality Issue'),
        ('quantity', 'Quantity Issue'),
        ('delivery', 'Delivery Issue'),
        ('payment', 'Payment Issue'),
        ('other', 'Other'),
    )
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('investigating', 'Investigating'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    )

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='disputes')
    complainant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='disputes_filed')
    respondent = models.ForeignKey(User, on_delete=models.CASCADE, related_name='disputes_received')
    dispute_type = models.CharField(max_length=50, choices=DISPUTE_TYPE_CHOICES)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    resolution = models.TextField(blank=True)
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='disputes_resolved')
    resolved_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dispute #{self.id} - {self.dispute_type}"


class DisputeMessage(models.Model):
    dispute = models.ForeignKey(Dispute, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    attachment = models.FileField(upload_to='dispute_attachments/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message on Dispute #{self.dispute.id}"
