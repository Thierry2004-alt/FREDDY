from rest_framework import serializers
from .models import Dispute, DisputeMessage


class DisputeMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = DisputeMessage
        fields = ['id', 'dispute', 'sender', 'sender_name', 'message', 'attachment', 'created_at']
        read_only_fields = ['id', 'created_at']


class DisputeSerializer(serializers.ModelSerializer):
    complainant_name = serializers.CharField(source='complainant.username', read_only=True)
    respondent_name = serializers.CharField(source='respondent.username', read_only=True)
    messages = DisputeMessageSerializer(many=True, read_only=True)

    class Meta:
        model = Dispute
        fields = ['id', 'order', 'complainant', 'complainant_name', 'respondent', 'respondent_name',
                  'dispute_type', 'description', 'status', 'resolution', 'resolved_by',
                  'resolved_at', 'messages', 'created_at', 'updated_at']
        read_only_fields = ['id', 'complainant', 'created_at', 'updated_at']


class DisputeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dispute
        fields = ['order', 'respondent', 'dispute_type', 'description']
        read_only_fields = []
