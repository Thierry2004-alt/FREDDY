import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { transporterAPI } from '../../services/api';
import { Colors, BorderRadius, Shadows } from '../../theme/theme';

export interface Transporter {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  phone_number: string;
  region: string;
  delivery_profile?: {
    vehicle_type: string;
    license_number: string;
    is_available: boolean;
    is_verified: boolean;
  };
}

interface TransporterSelectionScreenProps {
  navigation: any;
  route: any;
}

export default function TransporterSelectionScreen({ navigation, route }: any) {
  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const order = route.params?.order;
  const onSelect = route.params?.onSelect;

  useEffect(() => {
    loadTransporters();
  }, []);

  const loadTransporters = async () => {
    try {
      const response = await transporterAPI.list();
      setTransporters(response.data.results || response.data || []);
    } catch (error) {
      console.error('Failed to load transporters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedId || !order) return;
    try {
      await onSelect({ orderId: order.id, delivery_agent_id: selectedId });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', "Impossible d'assigner le transporteur");
    }
  };

  const renderItem = ({ item }: { item: Transporter }) => {
    const isSelected = item.id === selectedId;
    const profile = item.delivery_profile;

    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => setSelectedId(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.headerRow}>
          <View style={[styles.avatar, { backgroundColor: isSelected ? Colors.primary : Colors.surfaceSubtle }]}>
            <Ionicons name="person" size={20} color={isSelected ? Colors.textWhite : Colors.textSecondary} />
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
            <Text style={styles.phone}>{item.phone_number}</Text>
            <Text style={styles.region}>{item.region}</Text>
          </View>
          {isSelected && (
            <View style={styles.checkBadge}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
            </View>
          )}
        </View>

        {profile && (
          <View style={styles.profileRow}>
            <View style={styles.tag}>
              <Ionicons name="car-outline" size={14} color={Colors.primary} />
              <Text style={styles.tagText}>{profile.vehicle_type}</Text>
            </View>
            <View style={[styles.tag, profile.is_verified && styles.verifiedTag]}>
              <Ionicons name="shield-checkmark-outline" size={14} color={profile.is_verified ? '#059669' : Colors.textSecondary} />
              <Text style={[styles.tagText, profile.is_verified && styles.verifiedText]}>
                {profile.is_verified ? 'Vérifié' : 'En attente'}
              </Text>
            </View>
            <View style={[styles.tag, !profile.is_available && styles.unavailableTag]}>
              <Ionicons name="time-outline" size={14} color={profile.is_available ? '#2563EB' : Colors.textSecondary} />
              <Text style={[styles.tagText, !profile.is_available && styles.unavailableText]}>
                {profile.is_available ? 'Disponible' : 'Occupé'}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Chargement des transporteurs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, Shadows.sm]}>
        <Text style={styles.title}>Choisir un Transporteur</Text>
        <Text style={styles.subtitle}>Commande #{order?.id}</Text>
      </View>

      <FlatList
        data={transporters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Aucun transporteur disponible</Text>
            <Text style={styles.emptyText}>Réessayez ultérieurement.</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.confirmBtn, !selectedId && styles.confirmBtnDisabled]}
        onPress={handleConfirm}
        disabled={!selectedId}
        activeOpacity={0.8}
      >
        <Ionicons name="checkmark-circle-outline" size={20} color={Colors.textWhite} />
        <Text style={styles.confirmBtnText}>Assigner le Transporteur</Text>
      </TouchableOpacity>
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
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  listContent: {
    padding: 12,
    paddingBottom: 90,
    gap: 10,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  phone: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  region: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  checkBadge: {
    marginLeft: 8,
  },
  profileRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  verifiedTag: {
    backgroundColor: '#ECFDF5',
  },
  verifiedText: {
    color: '#065F46',
  },
  unavailableTag: {
    backgroundColor: '#F1F5F9',
  },
  unavailableText: {
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
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
    marginTop: 4,
  },
  confirmBtn: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadows.lg,
  },
  confirmBtnDisabled: {
    backgroundColor: Colors.textMuted,
  },
  confirmBtnText: {
    color: Colors.textWhite,
    fontSize: 15,
    fontWeight: '800',
  },
});
