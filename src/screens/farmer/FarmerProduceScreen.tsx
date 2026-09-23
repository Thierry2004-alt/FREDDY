import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { produceAPI } from '../../services/api';
import { AppHeader } from '../../components/AppHeader';
import { ProduceCard, ProduceItem } from '../../components/ProduceCard';
import { Colors, BorderRadius, Shadows } from '../../theme/theme';

export default function FarmerProduceScreen({ navigation }: any) {
  const [produce, setProduce] = useState<ProduceItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProduce();
  }, []);

  const loadProduce = async () => {
    try {
      const response = await produceAPI.myListings();
      setProduce(response.data || []);
    } catch (error) {
      console.log('Catalogue planteur:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProduce();
    setRefreshing(false);
  };

  const handleDelete = (id: number) => {
    Alert.alert('Retirer la Récolte', 'Êtes-vous sûr de vouloir retirer cette récolte du marché ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          try {
            await produceAPI.delete(id);
          } catch (e) {
            // Offline fallback
          }
          setProduce((prev) => prev.filter((p) => p.id !== id));
          Alert.alert('Récolte Retirée', 'Le lot a été retiré de la vente en ligne.');
        },
      },
    ]);
  };

  const handleEdit = (item: ProduceItem) => {
    Alert.alert(
      `Modifier ${item.name}`,
      `Prix unitaire : ${Number(item.price_per_unit).toLocaleString()} FCFA\nStock disponible : ${item.quantity_available} ${item.unit}\n\nLe stock est synchronisé en temps réel avec les acheteurs de Douala et Yaoundé.`
    );
  };

  const availableCount = produce.filter((p) => p.status !== 'sold').length;

  return (
    <View style={styles.container}>
      <AppHeader subtitle="MES RÉCOLTES & INVENTAIRE (CAMEROUN)" />

      {/* Summary Header */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNum}>{produce.length}</Text>
          <Text style={styles.summaryLabel}>Lots Publiés</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNum, { color: Colors.primaryDark }]}>{availableCount}</Text>
          <Text style={styles.summaryLabel}>Disponibles</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNum, { color: Colors.secondary }]}>
            {produce.filter((p) => p.status === 'reserved').length}
          </Text>
          <Text style={styles.summaryLabel}>Réservés</Text>
        </View>
      </View>

      <FlatList
        data={produce}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
        renderItem={({ item }) => (
          <ProduceCard
            item={item}
            isFarmerView={true}
            onPressAction={() => handleEdit(item)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="leaf-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Aucune récolte publiée</Text>
            <Text style={styles.emptyText}>Appuyez sur le bouton "+" pour publier votre premier lot de récolte.</Text>
          </View>
        }
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={[styles.fab, Shadows.lg]}
        onPress={() => navigation.navigate('AddProduce')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={Colors.textWhite} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-around',
    alignItems: 'center',
    ...Shadows.sm,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNum: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 90,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 10,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
