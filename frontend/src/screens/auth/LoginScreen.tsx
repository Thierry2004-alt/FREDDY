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

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Champs Requis', 'Veuillez renseigner votre nom d\'utilisateur et mot de passe.');
      return;
    }

    setIsLoading(true);
    try {
      await login(username.trim(), password);
    } catch (error: any) {
      let msg = 'Nom d\'utilisateur ou mot de passe incorrect.';
      if (error.response?.data?.error) {
        msg = error.response.data.error;
      } else if (error.response?.data?.non_field_errors?.[0]) {
        msg = error.response.data.non_field_errors[0];
      } else if (error.message === 'Network Error' || !error.response) {
        msg = 'Impossible de contacter le serveur AgriDirect. Vérifiez votre connexion réseau.';
      }
      Alert.alert('Échec de Connexion', msg);
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
        {/* Brand Hero Header */}
        <View style={styles.heroSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="leaf" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.brandTitle}>AgriDirect Cameroun</Text>
          <Text style={styles.brandSubtitle}>
            Plateforme d'approvisionnement direct entre producteurs ruraux et acheteurs en gros
          </Text>
        </View>

        {/* Login Card */}
        <View style={[styles.card, Shadows.md]}>
          <Text style={styles.cardHeader}>Connexion</Text>
          <Text style={styles.cardSub}>Entrez vos identifiants pour accéder à votre compte.</Text>

          <AppInput
            label="Nom d'utilisateur"
            icon="person-outline"
            placeholder="Ex: ThierryHenry, kamga_foumbot..."
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <AppInput
            label="Mot de passe"
            icon="lock-closed-outline"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <AppButton
            title="Se Connecter"
            onPress={handleLogin}
            loading={isLoading}
            variant="primary"
            icon="log-in-outline"
            size="lg"
            style={styles.loginBtn}
          />

          {/* Register Footer */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Nouveau sur AgriDirect ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signUpLink}>Créer un Compte</Text>
            </TouchableOpacity>
          </View>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 26,
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 16,
    lineHeight: 19,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cardSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
  },
  loginBtn: {
    marginTop: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});
