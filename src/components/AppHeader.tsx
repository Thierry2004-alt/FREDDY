import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Colors, Shadows } from '../theme/theme';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showLogout?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showLogout = true,
}) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const displayName = title || (user ? `${user.first_name || user.username}` : 'AgriDirect');
  const roleDisplay = subtitle || (user?.role ? user.role.toUpperCase() : 'MARKETPLACE');

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftSection}>
        <View style={styles.avatarBadge}>
          <Ionicons name="leaf" size={20} color={Colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.greeting} numberOfLines={1}>
            {user ? `Hello, ${displayName}` : displayName}
          </Text>
          <View style={styles.roleRow}>
            <View style={styles.activeDot} />
            <Text style={styles.roleText}>{roleDisplay}</Text>
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        {showLogout && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    ...Shadows.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginRight: 5,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.6,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
