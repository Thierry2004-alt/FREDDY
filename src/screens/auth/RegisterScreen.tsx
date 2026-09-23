import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { Colors, BorderRadius, Shadows } from '../../theme/theme';

const ROLES = [
  {
    id: 'farmer',
    title: 'Producteur / Planteur',
    icon: 'leaf-outline' as const,
    desc: 'Vendez vos vivres frais en gros (Foumbot, Njombé, Santa, Maroua...)',
  },
  {
    id: 'buyer',
    title: 'Acheteur en Gros',
    icon: 'cart-outline' as const,
    desc: 'Hôtels, restaurants, traiteurs et grossistes (Douala, Yaoundé...)',
  },
  {
    id: 'delivery',
    title: 'Transporteur Agréé',
    icon: 'cube-outline' as const,
    desc: 'Acheminement sécurisé sur les corridors et axes lourds du Cameroun',
  },
];

const VEHICLE_TYPES = [
  'Camionnette Frigorifique (3.5T)',
  'Pick-up Toyota Hilux',
  'Fourgon Isuzu',
  'Triporteur Moto-Cargo',
  'Gros Porteur (10T+)',
];

export default function RegisterScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [region, setRegion] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [role, setRole] = useState<'farmer' | 'buyer' | 'delivery'>('farmer');

  // Delivery-specific verification state
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Camionnette Frigorifique (3.5T)');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [hasInsuranceDoc, setHasInsuranceDoc] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    const cleanUsername = username.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phoneNumber.trim();
    const cleanRegion = region.trim();
    const cleanLicense = licenseNumber.trim();
    const cleanPlate = vehiclePlate.trim();

    if (!cleanUsername) {
      Alert.alert('Champs Requis', 'Veuillez saisir un nom d\'utilisateur.');
      return;
    }

    if (!password) {
      Alert.alert('Champs Requis', 'Veuillez saisir un mot de passe.');
      return;
    }

    if (password !== passwordConfirm) {
      Alert.alert('Erreur Mot de Passe', 'Les mots de passe ne correspondent pas.');
      return;
    }

    if (role === 'delivery' && !cleanLicense) {
      Alert.alert(
        'Pièce Requise',
        'Pour créer un compte Transporteur, le numéro de permis de conduire (ou CNI) est obligatoire pour la sécurité des cargaisons.'
      );
      return;
    }

    setIsLoading(true);
    try {
      await register({
        username: cleanUsername,
        email: cleanEmail || `${cleanUsername}@agridirect.cm`,
        password,
        password_confirm: passwordConfirm,
        role,
        phone_number: cleanPhone || '+237 677 00 00 00',
        region: cleanRegion || (role === 'farmer' ? 'Ouest (Foumbot)' : 'Littoral (Douala)'),
        license_number: role === 'delivery' ? cleanLicense : '',
        vehicle_type:
          role === 'delivery'
            ? `${vehicleType} ${cleanPlate ? '(' + cleanPlate + ')' : ''}`.trim()
            : '',
      });
      // Do not call navigation.goBack() because setting user in AuthContext automatically switches to the dashboard!
    } catch (error: any) {
      let msg = 'Échec de l\'inscription. Veuillez vérifier les informations saisies.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          msg = error.response.data;
        } else if (error.response.data.error) {
          msg = error.response.data.error;
        } else if (error.response.data.non_field_errors) {
          msg = Array.isArray(error.response.data.non_field_errors)
            ? error.response.data.non_field_errors.join(', ')
            : String(error.response.data.non_field_errors);
        } else {
          msg = Object.entries(error.response.data)
            .map(([field, errs]) => {
              const text = Array.isArray(errs) ? errs.join(', ') : String(errs);
              return `• ${field}: ${text}`;
            })
            .join('\n');
        }
      }
      Alert.alert('Erreur d\'inscription', msg);
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
        <View style={styles.header}>
          <Text style={styles.title}>Créer un Compte</Text>
          <Text style={styles.subtitle}>
            Plateforme d'approvisionnement agricole direct au Cameroun
          </Text>
        </View>

        {/* Role Selector Cards - Strictly Farmer, Buyer, Delivery (NO ADMIN) */}
        <Text style={styles.sectionLabel}>CHOISISSEZ VOTRE ACTIVITÉ SUR LA PLATEFORME</Text>
        <View style={styles.roleGrid}>
          {ROLES.map((r) => {
            const isSelected = role === r.id;
            return (
              <TouchableOpacity
                key={r.id}
                style={[
                  styles.roleCard,
                  isSelected ? styles.roleCardActive : styles.roleCardInactive,
                ]}
                onPress={() => setRole(r.id as any)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.roleIconCircle,
                    isSelected ? styles.iconCircleActive : styles.iconCircleInactive,
                  ]}
                >
                  <Ionicons
                    name={r.icon}
                    size={20}
                    color={isSelected ? Colors.primaryDark : Colors.textMuted}
                  />
                </View>
                <View style={styles.roleTexts}>
                  <Text
                    style={[
                      styles.roleTitle,
                      isSelected && styles.roleTitleActive,
                    ]}
                  >
                    {r.title}
                  </Text>
                  <Text style={styles.roleDesc} numberOfLines={2}>
                    {r.desc}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Form Fields Card */}
        <View style={[styles.formCard, Shadows.sm]}>
          <AppInput
            label="Nom d'utilisateur *"
            icon="person-outline"
            placeholder="Ex: kamga_foumbot"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <AppInput
            label="Adresse Email"
            icon="mail-outline"
            placeholder="Ex: contact@ferme.cm"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <AppInput
            label="Numéro de Téléphone (WhatsApp / MoMo / OM)"
            icon="call-outline"
            placeholder="+237 6XX XX XX XX"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          <AppInput
            label="Bassin Agricole ou Ville *"
            icon="location-outline"
            placeholder="Ex: Ouest (Foumbot), Littoral (Douala), Centre (Yaoundé)"
            value={region}
            onChangeText={setRegion}
          />

          {/* Delivery Specific Verification Fields */}
          {role === 'delivery' && (
            <View style={styles.deliveryDocsSection}>
              <View style={styles.docsSectionHeader}>
                <Ionicons name="shield-checkmark" size={18} color="#059669" />
                <Text style={styles.docsSectionTitle}>
                  Agrément & Pièces Transporteur (Obligatoire)
                </Text>
              </View>

              <AppInput
                label="Numéro de Permis de Conduire (ou CNI) *"
                icon="card-outline"
                placeholder="Ex: Permis Catégorie B/C N° 10928/LT"
                value={licenseNumber}
                onChangeText={setLicenseNumber}
              />

              <Text style={styles.subFieldLabel}>TYPE DE VÉHICULE UTILISÉ</Text>
              <View style={styles.vehicleTypeChips}>
                {VEHICLE_TYPES.map((vt) => (
                  <TouchableOpacity
                    key={vt}
                    style={[
                      styles.vtChip,
                      vehicleType === vt && styles.vtChipActive,
                    ]}
                    onPress={() => setVehicleType(vt)}
                  >
                    <Text
                      style={[
                        styles.vtChipText,
                        vehicleType === vt && styles.vtChipTextActive,
                      ]}
                    >
                      {vt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <AppInput
                label="Numéro de Plaque d'Immatriculation"
                icon="car-outline"
                placeholder="Ex: LT-4829-NW"
                value={vehiclePlate}
                onChangeText={setVehiclePlate}
              />

              {/* Verified Documents Badge */}
              <TouchableOpacity
                style={styles.docUploadBox}
                onPress={() => setHasInsuranceDoc(!hasInsuranceDoc)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={hasInsuranceDoc ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={hasInsuranceDoc ? Colors.primary : Colors.textMuted}
                />
                <View style={styles.docUploadTexts}>
                  <Text style={styles.docUploadTitle}>
                    Assurance Marchandises & Carte Grise en Règle
                  </Text>
                  <Text style={styles.docUploadSub}>
                    Certificat CEMAC valide pour le fret inter-régional
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          <AppInput
            label="Mot de passe *"
            icon="lock-closed-outline"
            placeholder="Au moins 6 caractères"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <AppInput
            label="Confirmer le Mot de passe *"
            icon="shield-checkmark-outline"
            placeholder="Répétez votre mot de passe"
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            secureTextEntry
          />

          <AppButton
            title="Créer mon Compte"
            onPress={handleRegister}
            loading={isLoading}
            variant="primary"
            size="lg"
            icon="checkmark-circle-outline"
            style={styles.submitBtn}
          />
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Vous avez déjà un compte ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signInLink}>Se Connecter</Text>
          </TouchableOpacity>
        </View>
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
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    marginVertical: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 8,
  },
  roleGrid: {
    gap: 10,
    marginBottom: 18,
  },
  roleCard: {
    padding: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleCardActive: {
    backgroundColor: Colors.surface,
    borderColor: Colors.primary,
    ...Shadows.sm,
  },
  roleCardInactive: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  roleIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconCircleActive: {
    backgroundColor: Colors.primaryMuted,
  },
  iconCircleInactive: {
    backgroundColor: Colors.surfaceSubtle,
  },
  roleTexts: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  roleTitleActive: {
    color: Colors.primaryDark,
  },
  roleDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deliveryDocsSection: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderRadius: BorderRadius.lg,
    padding: 14,
    marginVertical: 10,
  },
  docsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  docsSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  subFieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  vehicleTypeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  vtChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  vtChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  vtChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  vtChipTextActive: {
    color: Colors.textWhite,
  },
  docUploadBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#86EFAC',
    gap: 10,
    marginTop: 4,
  },
  docUploadTexts: {
    flex: 1,
  },
  docUploadTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  docUploadSub: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  submitBtn: {
    marginTop: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});
