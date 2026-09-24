from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Dispute, DisputeMessage
from .serializers import DisputeSerializer, DisputeCreateSerializer, DisputeMessageSerializer
from users.models import User


class DisputeViewSet(viewsets.ModelViewSet):
    serializer_class = DisputeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Dispute.objects.all().select_related('complainant', 'respondent', 'order', 'resolved_by').prefetch_related('messages')
        return Dispute.objects.filter(complainant=user).select_related('complainant', 'respondent', 'order', 'resolved_by').prefetch_related('messages')

    def get_serializer_class(self):
        if self.action == 'create':
            return DisputeCreateSerializer
        return DisputeSerializer

    def perform_create(self, serializer):
        serializer.save(complainant=self.request.user)

    @action(detail=True, methods=['post'])
    def add_message(self, request, pk=None):
        dispute = self.get_object()
        message = request.data.get('message')
        attachment = request.data.get('attachment')

        if not message:
            return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)

        DisputeMessage.objects.create(
            dispute=dispute,
            sender=request.user,
            message=message,
            attachment=attachment
        )
        return Response({'message': 'Message added successfully'})

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        dispute = self.get_object()
        if request.user.role != 'admin':
            return Response({'error': 'Only admins can resolve disputes'}, status=status.HTTP_403_FORBIDDEN)
        resolution = request.data.get('resolution')
        if not resolution:
            return Response({'error': 'Resolution is required'}, status=status.HTTP_400_BAD_REQUEST)
        dispute.status = 'resolved'
        dispute.resolution = resolution
        dispute.resolved_by = request.user
        from django.utils import timezone
        dispute.resolved_at = timezone.now()
        dispute.save()
        return Response({'message': 'Dispute resolved'})
