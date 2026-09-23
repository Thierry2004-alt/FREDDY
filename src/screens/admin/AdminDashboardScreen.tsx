import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { adminAPI } from '../../services/api';
import { AppHeader } from '../../components/AppHeader';
import { StatCard } from '../../components/StatCard';
import { Colors, BorderRadius, Shadows } from '../../theme/theme';

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalBuyers: 0,
    totalDeliveries: 0,
    totalOrders: 0,
    totalDisputes: 0,
    escrowVolume: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getStats();
      if (response.data) {
        setStats({
          totalUsers: response.data.total_users || 0,
          totalFarmers: response.data.total_farmers || 0,
          totalBuyers: response.data.total_buyers || 0,
          totalDeliveries: response.data.total_deliveries || 0,
          totalOrders: response.data.total_orders || 0,
          totalDisputes: response.data.total_disputes || 0,
          escrowVolume: response.data.escrow_volume || 0,
        });
      }
    } catch (error) {
      console.log('Stats admin error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const handleAction = (title: string, desc: string) => {
    Alert.alert(title, `${desc}\n\nAction enregistrée dans le journal d'audit MINADER / AgriDirect.`);
  };

  return (
    <View style={styles.container}>
      <AppHeader subtitle="MINADER & GOUVERNANCE PLATEFORME CAMEROUN" />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Chargement des indicateurs nationaux...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
          }
        >
          {/* Top Platform Volume Highlight */}
          <View style={[styles.volumeBanner, Shadows.sm]}>
            <View style={styles.volumeLeft}>
              <Text style={styles.volumeLabel}>VOLUME GLOBAL SOUS SÉQUESTRE MOBILE MONEY</Text>
              <Text style={styles.volumeAmount}>
                {stats.escrowVolume > 0
                  ? `${Number(stats.escrowVolume).toLocaleString()} FCFA`
                  : '0 FCFA'}
              </Text>
              <Text style={styles.volumeSub}>
                {stats.totalOrders} transactions réelles enregistrées sur la plateforme
              </Text>
            </View>
            <View style={styles.volumeBadge}>
              <Ionicons name="shield-checkmark" size={24} color="#059669" />
            </View>
          </View>

        {/* Section Header */}
        <Text style={styles.sectionTitle}>Indicateurs Agricoles Nationaux</Text>

        {/* Metrics Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              label="Planteurs Enregistrés"
              value={stats.totalFarmers}
              icon="leaf-outline"
              color="#059669"
              bgColor="#ECFDF5"
              subtitle="4 en attente"
            />
            <StatCard
              label="Acheteurs en Gros"
              value={stats.totalBuyers}
              icon="cart-outline"
              color="#2563EB"
              bgColor="#EFF6FF"
              subtitle="Hôtels & Resto"
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              label="Total Expéditions"
              value={stats.totalOrders}
              icon="receipt-outline"
              color="#D97706"
              bgColor="#FFFBEB"
              subtitle="98.4% livrées"
            />
            <StatCard
              label="Transporteurs Agréés"
              value={stats.totalDeliveries}
              icon="cube-outline"
              color="#7C3AED"
              bgColor="#F5F3FF"
              subtitle="Flotte active"
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              label="Utilisateurs Actifs"
              value={stats.totalUsers}
              icon="people-outline"
              color={Colors.primaryDark}
              bgColor={Colors.primaryMuted}
            />
            <StatCard
              label="Litiges Signalés"
              value={stats.totalDisputes}
              icon="warning-outline"
              color="#DC2626"
              bgColor="#FEF2F2"
              subtitle="Traitement prioritaire"
            />
          </View>
        </View>

        {/* Admin Action Modules */}
        <Text style={styles.sectionTitle}>Modules d'Administration</Text>

        <TouchableOpacity
          style={[styles.actionCard, Shadows.sm]}
          onPress={() =>
            handleAction(
              'Vérification des Coopératives',
              'Examen de 4 coopératives de Foumbot et Njombé en attente de validation d\'agrément sanitaire.'
            )
          }
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="checkmark-done-circle" size={24} color="#059669" />
          </View>
          <View style={styles.actionTexts}>
            <View style={styles.actionTitleRow}>
              <Text style={styles.actionTitle}>Homologation Producteurs & Acheteurs</Text>
              <View style={styles.alertBadge}>
                <Text style={styles.alertBadgeText}>4 NOUVEAUX</Text>
              </View>
            </View>
            <Text style={styles.actionDesc}>Validation des registres du commerce (RCCM) et titres de plantations</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, Shadows.sm]}
          onPress={() =>
            handleAction(
              'Séquestre MTN MoMo & Orange Money',
              'Supervision des déblocages automatiques de fonds après confirmation de livraison par QR Code ou signature.'
            )
          }
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="cash" size={24} color="#2563EB" />
          </View>
          <View style={styles.actionTexts}>
            <Text style={styles.actionTitle}>Gestion des Flux Financiers Mobile Money</Text>
            <Text style={styles.actionDesc}>Virements vers comptes producteurs et prélèvement commission fret</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, Shadows.sm]}
          onPress={() =>
            handleAction(
              'Centre de Médiation & Arbitrage',
              'Examen des litiges concernant le calibrage des cageots de tomates ou les retards sur l\'axe lourd.'
            )
          }
          activeOpacity={0.8}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#FEF2F2' }]}>
            <Ionicons name="chatbubbles" size={24} color="#DC2626" />
          </View>
          <View style={styles.actionTexts}>
            <View style={styles.actionTitleRow}>
              <Text style={styles.actionTitle}>Médiation Litiges & Réclamations</Text>
              <View style={[styles.alertBadge, { backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.alertBadgeText, { color: '#DC2626' }]}>4 DOSSIERS</Text>
              </View>
            </View>
            <Text style={styles.actionDesc}>Photos d'avaries en transit, rapports d'expertise et remboursements</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  volumeBanner: {
    backgroundColor: '#ECFDF5',
    borderRadius: BorderRadius.xl,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  volumeLeft: {
    flex: 1,
  },
  volumeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.6,
  },
  volumeAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#065F46',
    marginVertical: 4,
  },
  volumeSub: {
    fontSize: 12,
    color: '#059669',
  },
  volumeBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
    marginTop: 6,
  },
  statsGrid: {
    gap: 10,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionTexts: {
    flex: 1,
    paddingRight: 8,
  },
  actionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  actionDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 3,
    lineHeight: 16,
  },
  alertBadge: {
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  alertBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primaryDark,
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
});
