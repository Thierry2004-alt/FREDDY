import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius } from '../theme/theme';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = (status || '').toLowerCase();

  let bg = Colors.surfaceSubtle;
  let text = Colors.textSecondary;
  let dot = Colors.textMuted;

  switch (normalized) {
    case 'delivered':
    case 'completed':
    case 'available':
      bg = '#ECFDF5';
      text = '#059669';
      dot = '#10B981';
      break;
    case 'pending':
    case 'reserved':
    case 'assigned':
      bg = '#FFFBEB';
      text = '#D97706';
      dot = '#F59E0B';
      break;
    case 'shipped':
    case 'in_transit':
    case 'picked_up':
    case 'confirmed':
      bg = '#EFF6FF';
      text = '#2563EB';
      dot = '#3B82F6';
      break;
    case 'processing':
      bg = '#F5F3FF';
      text = '#7C3AED';
      dot = '#8B5CF6';
      break;
    case 'cancelled':
    case 'failed':
    case 'sold':
      bg = '#FEF2F2';
      text = '#DC2626';
      dot = '#EF4444';
      break;
  }

  const isSmall = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: bg }, isSmall && styles.badgeSm]}>
      <View style={[styles.dot, { backgroundColor: dot }, isSmall && styles.dotSm]} />
      <Text style={[styles.text, { color: text }, isSmall && styles.textSm]}>
        {normalized.replace('_', ' ').toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  dotSm: {
    width: 5,
    height: 5,
    marginRight: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textSm: {
    fontSize: 10,
  },
});
