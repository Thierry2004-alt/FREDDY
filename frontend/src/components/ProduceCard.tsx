import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Shadows } from '../theme/theme';
import { StatusBadge } from './StatusBadge';
import { AppButton } from './AppButton';

export interface ProduceItem {
  id: number;
  name: string;
  category?: string;
  farmer_name?: string;
  location?: string;
  price_per_unit: number | string;
  unit: string;
  quantity_available: number | string;
  harvest_date?: string;
  expiry_date?: string;
  is_organic?: boolean;
  status?: string;
}

interface ProduceCardProps {
  item: ProduceItem;
  onPressAction?: () => void;
  actionTitle?: string;
  actionVariant?: 'primary' | 'secondary' | 'outline';
  isFarmerView?: boolean;
  onDelete?: () => void;
}

const getCategoryIcon = (category: string = ''): keyof typeof Ionicons.glyphMap => {
  const cat = category.toLowerCase();
  if (cat.includes('fruit')) return 'nutrition';
  if (cat.includes('grain')) return 'basket';
  if (cat.includes('tuber')) return 'earth';
  if (cat.includes('legume')) return 'ellipse';
  return 'leaf';
};

export const ProduceCard: React.FC<ProduceCardProps> = ({
  item,
  onPressAction,
  actionTitle = 'Order Now',
  actionVariant = 'primary',
  isFarmerView = false,
  onDelete,
}) => {
  const categoryIcon = getCategoryIcon(item.category);

  return (
    <View style={[styles.card, Shadows.sm]}>
      {/* Header Row */}
      <View style={styles.topRow}>
        <View style={styles.categoryBadge}>
          <Ionicons name={categoryIcon} size={15} color={Colors.primary} />
          <Text style={styles.categoryText}>
            {(item.category || 'Produce').toUpperCase()}
          </Text>
        </View>
        <View style={styles.topRightRow}>
          {item.is_organic && (
            <View style={styles.organicBadge}>
              <Ionicons name="shield-checkmark" size={11} color="#059669" />
              <Text style={styles.organicText}>ORGANIC</Text>
            </View>
          )}
          {item.status && <StatusBadge status={item.status} size="sm" />}
        </View>
      </View>

      {/* Main Details */}
      <View style={styles.bodyRow}>
        <View style={styles.mainInfo}>
          <Text style={styles.title}>{item.name}</Text>
          {item.farmer_name ? (
            <View style={styles.metaRow}>
              <Ionicons name="person-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.metaText}>{item.farmer_name}</Text>
            </View>
          ) : null}
          {item.location ? (
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceValue}>{Number(item.price_per_unit || 0).toLocaleString()}</Text>
          <Text style={styles.currencyLabel}>FCFA / {item.unit}</Text>
        </View>
      </View>

      {/* Stock Bar & Harvest Date */}
      <View style={styles.infoRow}>
        <View style={styles.stockBox}>
          <Ionicons name="cube-outline" size={14} color={Colors.primary} />
          <Text style={styles.stockText}>
            <Text style={styles.stockBold}>{item.quantity_available}</Text> {item.unit} available
          </Text>
        </View>
        {item.harvest_date && (
          <Text style={styles.harvestText}>Harvest: {item.harvest_date}</Text>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionRow}>
        {isFarmerView ? (
          <View style={styles.farmerActions}>
            <AppButton
              title="Edit Details"
              variant="outline"
              size="sm"
              icon="create-outline"
              onPress={onPressAction || (() => {})}
              style={styles.flexBtn}
            />
            {onDelete && (
              <TouchableOpacity
                onPress={onDelete}
                style={styles.deleteIconBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={18} color={Colors.danger} />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <AppButton
            title={actionTitle}
            variant={actionVariant}
            size="sm"
            icon="cart-outline"
            onPress={onPressAction || (() => {})}
            style={styles.fullWidthBtn}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 0.5,
  },
  topRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  organicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    gap: 3,
  },
  organicText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.4,
  },
  bodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mainInfo: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 5,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  currencyLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryDark,
    lineHeight: 24,
  },
  unitLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceSubtle,
    marginBottom: 8,
  },
  stockBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  stockBold: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  harvestText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  actionRow: {
    marginTop: 4,
  },
  farmerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flexBtn: {
    flex: 1,
  },
  deleteIconBtn: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.dangerMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthBtn: {
    width: '100%',
  },
});
