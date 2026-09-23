import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { produceAPI } from '../../services/api';
import { AppHeader } from '../../components/AppHeader';
import { CategoryFilter } from '../../components/CategoryFilter';
import { ProduceCard, ProduceItem } from '../../components/ProduceCard';
import { OrderCheckoutModal } from '../../components/OrderCheckoutModal';
import { Colors, BorderRadius, Shadows } from '../../theme/theme';

export default function BuyerBrowseScreen({ navigation }: any) {
  const [produce, setProduce] = useState<ProduceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItemForOrder, setSelectedItemForOrder] = useState<ProduceItem | null>(null);

  useEffect(() => {
    loadProduce();
  }, [selectedCategory]);

  const loadProduce = async () => {
    try {
      const response = await produceAPI.search({ category: selectedCategory || undefined });
      if (response.data) {
        setProduce(response.data);
      }
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProduce();
    setRefreshing(false);
  };

  const handleOrderSuccess = (newOrder: any) => {
    Alert.alert(
      'Commande Transmise !',
      `Votre commande #${newOrder.id} (${Number(newOrder.total || newOrder.total_price || 0).toLocaleString()} FCFA) est enregistrée et transmise au producteur.`,
      [
        { text: 'Continuer' },
        {
          text: 'Voir mes commandes',
          onPress: () => navigation.navigate('Dashboard'),
        },
      ]
    );
  };

  const filteredProduce = produce.filter((p) => {
    const matchesSearch =
      !searchQuery.trim() ||
      (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.farmer_name && p.farmer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  return (
    <View style={styles.container}>
      <AppHeader subtitle="MARCHÉ AGRO-ALIMENTAIRE CAMEROUN" />

      {/* Search Input Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, Shadows.sm]}>
          <Ionicons name="search-outline" size={20} color={Colors.primary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher récoltes (Tomates, Penja, Santa...)"
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Pills Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => setSelectedCategory(catId)}
      />

      {/* Results Counter & Info */}
      <View style={styles.resultsInfoRow}>
        <Text style={styles.resultsCount}>
          <Text style={styles.boldText}>{filteredProduce.length}</Text> produits disponibles
        </Text>
        <View style={styles.verifiedTag}>
          <Ionicons name="shield-checkmark" size={13} color={Colors.primaryDark} />
          <Text style={styles.verifiedText}>Producteurs Vérifiés</Text>
        </View>
      </View>

      {/* Produce Cards List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Chargement des produits du marché...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProduce}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProduceCard
              item={item}
              actionTitle="Commander en Gros"
              actionVariant="primary"
              onPressAction={() => setSelectedItemForOrder(item)}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="leaf-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>Aucun produit disponible</Text>
              <Text style={styles.emptyText}>Aucune récolte ne correspond à cette recherche.</Text>
            </View>
          }
        />
      )}

      {/* Real Interactive Order Checkout Modal */}
      <OrderCheckoutModal
        visible={!!selectedItemForOrder}
        item={selectedItemForOrder}
        onClose={() => setSelectedItemForOrder(null)}
        onOrderSuccess={handleOrderSuccess}
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
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  clearBtn: {
    padding: 4,
  },
  resultsInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  resultsCount: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  boldText: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  listContent: {
    paddingBottom: 30,
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
    lineHeight: 18,
  },
});
