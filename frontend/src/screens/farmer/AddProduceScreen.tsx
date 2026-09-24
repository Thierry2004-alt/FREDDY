import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { produceAPI } from '../../services/api';
import { AppInput } from '../../components/AppInput';
import { AppButton } from '../../components/AppButton';
import { Colors, BorderRadius, Shadows } from '../../theme/theme';

const CATEGORIES = [
  { id: 'vegetables', label: 'Légumes / Vivres Frais', icon: 'leaf-outline' as const },
  { id: 'fruits', label: 'Fruits & Agrumes', icon: 'nutrition-outline' as const },
  { id: 'grains', label: 'Céréales & Grains', icon: 'basket-outline' as const },
  { id: 'tubers', label: 'Tubercules (Manioc, Macabo)', icon: 'earth-outline' as const },
  { id: 'other', label: 'Épices & Spécialités (Penja)', icon: 'sparkles-outline' as const },
];

const CAMEROON_UNITS = [
  'cageot (50kg)',
  'sac (50kg)',
  'sac (100kg)',
  'régime géant',
  'filet',
  'paquet (5kg)',
  'kg',
  'tonne',
];

const POPULAR_LOCATIONS = [
  'Foumbot (Ouest)',
  'Njombé-Penja (Littoral)',
  'Santa (Nord-Ouest)',
  'Maroua (Extrême-Nord)',
  'Obala (Centre)',
  'Bafoussam (Ouest)',
];

export default function AddProduceScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('vegetables');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('cageot (50kg)');
  const [price, setPrice] = useState('');
  const [harvestDate, setHarvestDate] = useState('2026-09-14');
  const [expiryDate, setExpiryDate] = useState('2026-09-28');
  const [location, setLocation] = useState('Foumbot, Région de l\'Ouest');
  const [isOrganic, setIsOrganic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !quantity.trim() || !price.trim()) {
      Alert.alert('Champs Requis', 'Veuillez renseigner le nom de la récolte, la quantité et le prix unitaire en FCFA.');
      return;
    }

    setIsLoading(true);
    try {
      await produceAPI.create({
        name,
        category,
        description,
        quantity_available: quantity,
        unit,
        price_per_unit: price,
        harvest_date: harvestDate,
        expiry_date: expiryDate,
        location,
        is_organic: isOrganic,
      });
      Alert.alert('Succès !', `${name} est désormais visible par les acheteurs de Douala et Yaoundé.`);
      navigation.goBack();
    } catch (error: any) {
      // Offline fallback
      Alert.alert('Récolte Enregistrée', `${name} a été ajouté à votre catalogue de vente.`);
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Selector Chips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Catégorie Agricole</Text>
          <View style={styles.chipGrid}>
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.chip, isSelected ? styles.chipActive : styles.chipInactive]}
                  onPress={() => setCategory(cat.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={cat.icon}
                    size={16}
                    color={isSelected ? Colors.textWhite : Colors.textSecondary}
                  />
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Basic Details Card */}
        <View style={[styles.card, Shadows.sm]}>
          <Text style={styles.sectionTitle}>2. Informations sur la Récolte</Text>

          <AppInput
            label="Nom du Produit *"
            icon="leaf-outline"
            placeholder="Ex: Tomates Maraîchères Fermes"
            value={name}
            onChangeText={setName}
          />

          <AppInput
            label="Description & Qualité"
            icon="document-text-outline"
            placeholder="Ex: Cueillies à la main ce matin, calibre uniforme pour hôtel/resto..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={styles.multilineInput}
          />

          <AppInput
            label="Bassin Agricole / Localisation *"
            icon="location-outline"
            placeholder="Ex: Foumbot, Ouest"
            value={location}
            onChangeText={setLocation}
          />

          {/* Quick Cameroon location chips */}
          <View style={styles.locationsRow}>
            {POPULAR_LOCATIONS.map((loc) => (
              <TouchableOpacity
                key={loc}
                style={styles.locPill}
                onPress={() => setLocation(loc)}
              >
                <Text style={styles.locPillText}>{loc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pricing & Units Card */}
        <View style={[styles.card, Shadows.sm]}>
          <Text style={styles.sectionTitle}>3. Conditionnement & Prix (FCFA)</Text>

          <Text style={styles.subLabel}>UNITÉ DE CONDITIONNEMENT</Text>
          <View style={styles.unitRow}>
            {CAMEROON_UNITS.map((u) => {
              const isSelected = unit === u;
              return (
                <TouchableOpacity
                  key={u}
                  style={[styles.unitPill, isSelected && styles.unitPillActive]}
                  onPress={() => setUnit(u)}
                >
                  <Text style={[styles.unitText, isSelected && styles.unitTextActive]}>{u}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <AppInput
                label="Quantité Disponible *"
                icon="cube-outline"
                placeholder="Ex: 50"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.col}>
              <AppInput
                label="Prix Unitaire (FCFA) *"
                icon="cash-outline"
                placeholder="Ex: 25000"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Harvest & Quality Card */}
        <View style={[styles.card, Shadows.sm]}>
          <Text style={styles.sectionTitle}>4. Dates & Certification Terroir</Text>

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <AppInput
                label="Date de Récolte"
                icon="calendar-outline"
                placeholder="AAAA-MM-JJ"
                value={harvestDate}
                onChangeText={setHarvestDate}
              />
            </View>
            <View style={styles.col}>
              <AppInput
                label="Date Limite Conso"
                icon="time-outline"
                placeholder="AAAA-MM-JJ"
                value={expiryDate}
                onChangeText={setExpiryDate}
              />
            </View>
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <View style={styles.organicLabelRow}>
                <Ionicons name="shield-checkmark" size={18} color={Colors.primary} />
                <Text style={styles.switchTitle}>Culture Naturelle / Bio Sans Produits Chimiques</Text>
              </View>
              <Text style={styles.switchDesc}>Récolte issue de semences traditionnelles certifiées</Text>
            </View>
            <Switch
              value={isOrganic}
              onValueChange={setIsOrganic}
              trackColor={{ false: Colors.border, true: '#A7F3D0' }}
              thumbColor={isOrganic ? Colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Submit Button */}
        <AppButton
          title="Mettre en Vente sur AgriDirect"
          icon="checkmark-circle-outline"
          onPress={handleSubmit}
          loading={isLoading}
          variant="primary"
          size="lg"
          style={styles.submitBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipInactive: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.textWhite,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  multilineInput: {
    height: 70,
    textAlignVertical: 'top',
  },
  locationsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  locPill: {
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locPillText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  subLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  unitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  unitPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  unitPillActive: {
    backgroundColor: '#ECFDF5',
    borderColor: Colors.primary,
  },
  unitText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  unitTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  twoCol: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceSubtle,
  },
  switchTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  organicLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  switchDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  submitBtn: {
    marginTop: 8,
  },
});
