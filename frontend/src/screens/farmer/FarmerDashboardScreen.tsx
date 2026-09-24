import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { produceAPI, orderAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { AppHeader } from '../../components/AppHeader';
import { StatCard } from '../../components/StatCard';
import { OrderCard, OrderItem } from '../../components/OrderCard';
import { Colors, BorderRadius, Shadows } from '../../theme/theme';

export default function FarmerDashboardScreen({ navigation }: any) {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProduce: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalEarnings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const produceRes = await produceAPI.myListings();
      const ordersRes = await orderAPI.list();

      const prodList = produceRes.data || [];
      const orderList = ordersRes.data || [];

      setOrders(orderList);

      const pending = orderList.filter((o: any) => o.status === 'pending').length;
      const earnings = orderList
        .filter((o: any) => o.status === 'delivered')
        .reduce((sum: number, o: any) => sum + Number(o.total_price || o.total || 0), 0);

      setStats({
        totalProduce: prodList.length,
        totalOrders: orderList.length,
        pendingOrders: pending,
        totalEarnings: earnings,
      });
    } catch (error) {
      console.error('Erreur chargement données producteur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCallBuyer = (phone?: string) => {
    if (!phone) return;
    const clean = phone.replace(/\s+/g, '');
    Linking.openURL(`tel:${clean}`).catch(() => {
      Alert.alert('Appel', `Composition du ${phone}`);
    });
  };

  const handleWhatsAppBuyer = (phone?: string, buyer?: string) => {
    if (!phone) return;
    const clean = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Bonjour ${buyer || 'Acheteur'}, je suis le producteur pour votre commande sur AgriDirect Cameroun. La récolte est prête pour expédition.`
    );
    Linking.openURL(`https://wa.me/${clean}?text=${msg}`).catch(() => {
      Alert.alert('WhatsApp', `Impossible d'ouvrir WhatsApp`);
    });
  };

  const handleAcceptOrder = async (orderId: number) => {
    Alert.alert(
      'Assigner un Transporteur',
      `Voulez-vous confirmer la commande #${orderId} et assigner un transporteur ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            const target = navigation.getParent?.() || navigation;
            target.navigate('SelectTransporter', {
              order: { id: orderId },
              onSelect: handleTransporterSelected,
            });
          },
        },
      ]
    );
  };

  const handleTransporterSelected = async ({ orderId, delivery_agent_id }: { orderId: number; delivery_agent_id: number }) => {
    try {
      await orderAPI.assignTransporter(orderId, { delivery_agent_id });
      loadData();
      Alert.alert('Transporteur Assigné !', 'Le transporteur sélectionné a été notifié.');
    } catch (err) {
      Alert.alert('Erreur', "Impossible d'assigner le transporteur.");
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader subtitle="TABLEAU DE BORD PRODUCTEUR CAMEROUN" />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Chargement de vos données producteur...</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
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
              {/* KPI Metrics Grid in FCFA */}
              <View style={styles.statsGrid}>
                <View style={styles.statsRow}>
                  <StatCard
                    label="Mes Produits en Ligne"
                    value={stats.totalProduce}
                    icon="leaf-outline"
                    color={Colors.primaryDark}
                    bgColor={Colors.primaryMuted}
                  />
                  <StatCard
                    label="Commandes à Valider"
                    value={stats.pendingOrders}
                    icon="alert-circle-outline"
                    color="#D97706"
                    bgColor="#FFFBEB"
                  />
                </View>
                <View style={styles.statsRow}>
                  <StatCard
                    label="Total Commandes"
                    value={stats.totalOrders}
                    icon="receipt-outline"
                    color="#2563EB"
                    bgColor="#EFF6FF"
                  />
                  <StatCard
                    label="Revenus Encaissés"
                    value={`${Number(stats.totalEarnings).toLocaleString()} FCFA`}
                    icon="cash-outline"
                    color="#059669"
                    bgColor="#ECFDF5"
                  />
                </View>
              </View>

              {/* Fast Action Buttons Bar */}
              <View style={styles.actionSection}>
                <TouchableOpacity
                  style={[styles.primaryActionBtn, Shadows.sm]}
                  onPress={() => navigation.navigate('AddProduce')}
                  activeOpacity={0.8}
                >
                  <View style={styles.btnIconCircle}>
                    <Ionicons name="add" size={22} color={Colors.textWhite} />
                  </View>
                  <View style={styles.btnTexts}>
                    <Text style={styles.actionBtnTitle}>Mettre en Vente une Récolte</Text>
                    <Text style={styles.actionBtnSubtitle}>
                      Publiez vos vivres frais pour les acheteurs de Douala et Yaoundé
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.primaryDark} />
                </TouchableOpacity>
              </View>

              {/* Section Header */}
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Commandes Reçues</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{orders.length} commandes</Text>
                </View>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.orderWrapper}>
              <OrderCard
                order={item}
                userRole="farmer"
                actionTitle={item.status === 'pending' ? 'Confirmer & Récolter' : undefined}
                onActionPress={() => handleAcceptOrder(item.id)}
              />
              {item.buyer_phone ? (
                <View style={styles.quickContactBar}>
                  <TouchableOpacity
                    style={styles.contactIconBtn}
                    onPress={() => handleCallBuyer(item.buyer_phone)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="call-outline" size={15} color="#059669" />
                    <Text style={styles.contactBtnText}>Appeler l'Acheteur</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.contactIconBtn}
                    onPress={() => handleWhatsAppBuyer(item.buyer_phone, item.buyer_name)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="logo-whatsapp" size={15} color="#16A34A" />
                    <Text style={[styles.contactBtnText, { color: '#16A34A' }]}>WhatsApp</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>Aucune commande reçue</Text>
              <Text style={styles.emptyText}>
                Les commandes passées par les acheteurs apparaîtront ici.
              </Text>
            </View>
          }
        />
      )}
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
  statsGrid: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionSection: {
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
  },
  primaryActionBtn: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderRadius: BorderRadius.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  btnTexts: {
    flex: 1,
  },
  actionBtnTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
  },
  actionBtnSubtitle: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  countBadge: {
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  orderWrapper: {
    marginBottom: 10,
  },
  quickContactBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: -8,
    marginBottom: 10,
    gap: 8,
  },
  contactIconBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
    ...Shadows.sm,
  },
  contactBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
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
    marginTop: 4,
  },
});
