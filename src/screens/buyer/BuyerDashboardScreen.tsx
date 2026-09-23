import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { orderAPI } from '../../services/api';
import { AppHeader } from '../../components/AppHeader';
import { StatCard } from '../../components/StatCard';
import { OrderCard, OrderItem } from '../../components/OrderCard';
import { OrderTrackingModal } from '../../components/OrderTrackingModal';
import { Colors, BorderRadius, Shadows } from '../../theme/theme';

export default function BuyerDashboardScreen({ navigation }: any) {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<OrderItem | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.list();
      if (response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  // Stats calculation
  const totalSpent = orders.reduce(
    (sum, o) => sum + Number(o.total || o.total_price || o.total_amount || 0),
    0
  );
  const activeCount = orders.filter((o) =>
    ['pending', 'confirmed', 'processing', 'in_transit', 'shipped'].includes(
      (o.status || '').toLowerCase()
    )
  ).length;
  const completedCount = orders.filter(
    (o) => (o.status || '').toLowerCase() === 'delivered'
  ).length;

  const filteredOrders = orders.filter((o) => {
    const s = (o.status || '').toLowerCase();
    if (filter === 'active') {
      return ['pending', 'confirmed', 'processing', 'in_transit', 'shipped'].includes(s);
    }
    if (filter === 'completed') {
      return s === 'delivered';
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <AppHeader subtitle="ACHETEUR EN GROS" />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Chargement des commandes depuis le serveur...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              {/* KPI Cards in FCFA */}
              <View style={styles.statsRow}>
                <StatCard
                  label="Dépenses Totales"
                  value={`${Number(totalSpent).toLocaleString()} FCFA`}
                  icon="wallet-outline"
                  color={Colors.primaryDark}
                  bgColor={Colors.primaryMuted}
                />
                <StatCard
                  label="En Acheminement"
                  value={activeCount}
                  icon="navigate-outline"
                  color="#2563EB"
                  bgColor="#EFF6FF"
                />
                <StatCard
                  label="Livrées"
                  value={completedCount}
                  icon="checkmark-done-circle-outline"
                  color="#059669"
                  bgColor="#ECFDF5"
                />
              </View>

              {/* Quick Marketplace Action Banner */}
              <TouchableOpacity
                style={[styles.banner, Shadows.sm]}
                onPress={() => navigation.navigate('Browse')}
                activeOpacity={0.8}
              >
                <View style={styles.bannerLeft}>
                  <Text style={styles.bannerTitle}>Explorer le Marché Agricole</Text>
                  <Text style={styles.bannerSubtitle}>
                    Approvisionnez votre établissement auprès des producteurs certifiés.
                  </Text>
                </View>
                <View style={styles.bannerIcon}>
                  <Ionicons name="arrow-forward-circle" size={32} color={Colors.primary} />
                </View>
              </TouchableOpacity>

              {/* Section Header & Filter Tabs */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Mes Commandes</Text>
                <View style={styles.filterPills}>
                  <TouchableOpacity
                    onPress={() => setFilter('all')}
                    style={[styles.pill, filter === 'all' && styles.pillActive]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        filter === 'all' && styles.pillTextActive,
                      ]}
                    >
                      Toutes ({orders.length})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setFilter('active')}
                    style={[styles.pill, filter === 'active' && styles.pillActive]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        filter === 'active' && styles.pillTextActive,
                      ]}
                    >
                      En cours ({activeCount})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setFilter('completed')}
                    style={[styles.pill, filter === 'completed' && styles.pillActive]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        filter === 'completed' && styles.pillTextActive,
                      ]}
                    >
                      Livrées ({completedCount})
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              userRole="buyer"
              actionTitle={item.status === 'in_transit' ? 'Suivi GPS Live' : 'Détails & Suivi'}
              onActionPress={() => setTrackedOrder(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>Aucune commande enregistrée</Text>
              <Text style={styles.emptyText}>
                Vous n'avez pas encore passé de commande. Rendez-vous sur le Marché pour commander des récoltes.
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Real Interactive Order Tracking Modal with GPS Maps & Carrier Phone */}
      <OrderTrackingModal
        visible={!!trackedOrder}
        order={trackedOrder}
        onClose={() => setTrackedOrder(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingBottom: 30,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  banner: {
    backgroundColor: '#ECFDF5',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: BorderRadius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  bannerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
  },
  bannerSubtitle: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
    lineHeight: 16,
  },
  bannerIcon: {
    paddingLeft: 4,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  filterPills: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.textWhite,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 12,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
