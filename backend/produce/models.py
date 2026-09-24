from django.db import models
from users.models import User


class Produce(models.Model):
    CATEGORY_CHOICES = (
        ('vegetables', 'Vegetables'),
        ('fruits', 'Fruits'),
        ('grains', 'Grains'),
        ('legumes', 'Legumes'),
        ('dairy', 'Dairy'),
        ('meat', 'Meat'),
        ('other', 'Other'),
    )
    STATUS_CHOICES = (
        ('available', 'Available'),
        ('reserved', 'Reserved'),
        ('sold', 'Sold'),
        ('expired', 'Expired'),
    )

    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='produces')
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField()
    quantity_available = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20)
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    harvest_date = models.DateField()
    expiry_date = models.DateField()
    location = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    is_organic = models.BooleanField(default=False)
    image = models.ImageField(upload_to='produce/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.farmer.username}"


class ProduceImage(models.Model):
    produce = models.ForeignKey(Produce, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='produce/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.produce.name}"
