import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Shadows } from '../theme/theme';
import { StatusBadge } from './StatusBadge';
import { AppButton } from './AppButton';

export interface OrderItem {
  id: number;
  produce?: string;
  produce_details?: {
    name: string;
    unit?: string;
  };
  buyer?: string;
  farmer?: string;
  quantity?: string | number;
  total?: number | string;
  total_price?: number | string;
  total_amount?: number | string;
  status: string;
  date?: string;
  created_at?: string;
}

interface OrderCardProps {
  order: OrderItem;
  userRole?: 'buyer' | 'farmer';
  onActionPress?: () => void;
  actionTitle?: string;
  onSecondaryPress?: () => void;
  secondaryTitle?: string;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  userRole = 'buyer',
  onActionPress,
  actionTitle,
  onSecondaryPress,
  secondaryTitle,
}) => {
  const produceName =
    (order as any).produce_name ||
    (typeof order.produce === 'string' ? order.produce : '') ||
    order.produce_details?.name ||
    'Vivres Frais du Cameroun';
  const totalAmount = order.total_price || order.total || order.total_amount || 0;
  const dateString = order.date || (order.created_at ? order.created_at.slice(0, 10) : 'Récemment');
  const counterpartName =
    userRole === 'buyer'
      ? (order as any).farmer_name || order.farmer || 'Producteur Agréé (Foumbot / Njombé)'
      : (order as any).buyer_name || order.buyer || 'Acheteur en Gros (Douala / Yaoundé)';

  return (
    <View style={[styles.card, Shadows.sm]}>
      {/* Header with Order ID & Status */}
      <View style={styles.headerRow}>
        <View style={styles.orderIdContainer}>
          <Ionicons name="receipt-outline" size={16} color={Colors.primary} />
          <Text style={styles.orderId}>Commande #{order.id}</Text>
        </View>
        <StatusBadge status={order.status} size="sm" />
      </View>

      {/* Produce Title & Counterpart Info */}
      <View style={styles.mainContent}>
        <Text style={styles.produceName}>{produceName}</Text>
        <View style={styles.partyRow}>
          <Ionicons
            name={userRole === 'buyer' ? 'leaf-outline' : 'business-outline'}
            size={14}
            color={Colors.primary}
          />
          <Text style={styles.partyText}>
            {userRole === 'buyer'
              ? `Producteur : ${counterpartName}`
              : `Acheteur : ${counterpartName}`}
          </Text>
        </View>
      </View>

      {/* Order Stats Row */}
      <View style={styles.metaBox}>
        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>QUANTITY</Text>
          <Text style={styles.metaVal}>{order.quantity || 'Bulk'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>TOTAL PRICE</Text>
          <Text style={styles.totalPrice}>{Number(totalAmount || 0).toLocaleString()} FCFA</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.metaCol}>
          <Text style={styles.metaLabel}>DATE</Text>
          <Text style={styles.metaVal}>{dateString}</Text>
        </View>
      </View>

      {/* Action Buttons if provided */}
      {(actionTitle || secondaryTitle) && (
        <View style={styles.actionRow}>
          {secondaryTitle && (
            <AppButton
              title={secondaryTitle}
              variant="outline"
              size="sm"
              onPress={onSecondaryPress || (() => {})}
              style={styles.actionBtn}
            />
          )}
          {actionTitle && (
            <AppButton
              title={actionTitle}
              variant="primary"
              size="sm"
              onPress={onActionPress || (() => {})}
              style={styles.actionBtn}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceSubtle,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderId: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  mainContent: {
    paddingVertical: 12,
  },
  produceName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  partyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  partyText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  metaBox: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.md,
    padding: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metaCol: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaVal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  totalPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
  },
});
