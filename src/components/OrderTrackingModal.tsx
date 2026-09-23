import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OrderItem } from './OrderCard';
import { RouteMapCard, RouteCoordinates } from './RouteMapCard';
import { StatusBadge } from './StatusBadge';
import { Colors, BorderRadius, Shadows } from '../theme/theme';

interface OrderTrackingModalProps {
  visible: boolean;
  order: OrderItem | null;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  visible,
  order,
  onClose,
}) => {
  if (!order) return null;

  const routeData: RouteCoordinates = {
    originName: 'Foumbot (Bassin Ouest)',
    originCoords: { lat: 5.5133, lng: 10.6319 },
    destName: 'Bonanjo, Douala (Littoral)',
    destCoords: { lat: 4.0511, lng: 9.7679 },
    distanceKm: 248,
    durationEst: '4h 15m',
    corridor: 'N5 (Foumbot - Bafoussam - Bekoko - Douala)',
    vehiclePlate: 'LT-4829-NW (Isuzu 3.5T Frigo)',
    driverName: 'Emmanuel Tchinda',
    driverPhone: '+237673334455',
    currentCheckpoint: 'Poste de Contrôle Bekoko (PK 85)',
  };

  const steps = [
    { title: 'Commande Validée & Réservée', done: true, time: '07:30' },
    { title: 'Récolte & Conditionnement en Cageots', done: true, time: '09:15' },
    { title: 'Prise en charge Transporteur à Foumbot', done: true, time: '11:00' },
    {
      title: 'En Transit sur l\'Axe Lourd (Bekoko)',
      done: ['in_transit', 'shipped', 'delivered'].includes(order.status),
      active: order.status === 'in_transit',
      time: '14:45',
    },
    {
      title: 'Livraison & Contrôle Qualité Réception',
      done: order.status === 'delivered',
      active: order.status === 'delivered',
      time: 'Prévu 16:30',
    },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalSheet, Shadows.lg]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <View style={styles.orderBadgeRow}>
                <Text style={styles.title}>Suivi Commande #{order.id}</Text>
                <StatusBadge status={order.status} size="sm" />
              </View>
              <Text style={styles.subtitle}>{order.produce || 'Cargaison Maraîchère'}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Live GPS Route Map */}
            <RouteMapCard route={routeData} />

            {/* Courier Profile Card */}
            <View style={[styles.carrierCard, Shadows.sm]}>
              <View style={styles.carrierAvatar}>
                <Ionicons name="person" size={24} color={Colors.primary} />
              </View>
              <View style={styles.carrierDetails}>
                <Text style={styles.carrierName}>Emmanuel Tchinda</Text>
                <Text style={styles.carrierVehicle}>Isuzu 3.5T Frigorifique • LT-4829-NW</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={13} color="#F59E0B" />
                  <Text style={styles.ratingText}>4.9/5 • 142 livraisons sécurisées</Text>
                </View>
              </View>
            </View>

            {/* Timeline Milestones */}
            <View style={[styles.timelineCard, Shadows.sm]}>
              <Text style={styles.timelineTitle}>Jalon d'Acheminement</Text>

              {steps.map((step, idx) => (
                <View key={idx} style={styles.timelineStep}>
                  <View style={styles.timelineIndicator}>
                    <View
                      style={[
                        styles.timelineCircle,
                        step.done && styles.circleDone,
                        step.active && styles.circleActive,
                      ]}
                    >
                      <Ionicons
                        name={step.done ? 'checkmark' : 'ellipse'}
                        size={12}
                        color={step.done ? Colors.textWhite : Colors.border}
                      />
                    </View>
                    {idx < steps.length - 1 && (
                      <View
                        style={[
                          styles.timelineBar,
                          step.done && styles.barDone,
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.stepContent}>
                    <View style={styles.stepHeader}>
                      <Text
                        style={[
                          styles.stepTitle,
                          step.done && styles.stepTitleDone,
                          step.active && styles.stepTitleActive,
                        ]}
                      >
                        {step.title}
                      </Text>
                      <Text style={styles.stepTime}>{step.time}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '94%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  orderBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingVertical: 14,
  },
  carrierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  carrierAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  carrierDetails: {
    flex: 1,
  },
  carrierName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  carrierVehicle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  timelineCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  timelineStep: {
    flexDirection: 'row',
    minHeight: 52,
  },
  timelineIndicator: {
    alignItems: 'center',
    width: 24,
    marginRight: 12,
  },
  timelineCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  circleDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  circleActive: {
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.primaryLight,
  },
  timelineBar: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: 3,
  },
  barDone: {
    backgroundColor: Colors.primary,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepTitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
    flex: 1,
    paddingRight: 8,
  },
  stepTitleDone: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  stepTitleActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  stepTime: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
