import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Shadows } from '../theme/theme';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  let btnBg = Colors.primary;
  let textColor = Colors.textWhite;
  let borderColor = 'transparent';
  let borderWidth = 0;

  switch (variant) {
    case 'secondary':
      btnBg = Colors.secondary;
      textColor = '#78350F';
      break;
    case 'outline':
      btnBg = 'transparent';
      textColor = Colors.primary;
      borderColor = Colors.primary;
      borderWidth = 1.5;
      break;
    case 'ghost':
      btnBg = Colors.surfaceSubtle;
      textColor = Colors.textPrimary;
      break;
    case 'danger':
      btnBg = Colors.danger;
      textColor = Colors.textWhite;
      break;
  }

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: btnBg,
          borderColor,
          borderWidth,
          opacity: disabled ? 0.6 : 1,
        },
        variant === 'primary' && Shadows.sm,
        isSmall && styles.btnSm,
        isLarge && styles.btnLg,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Ionicons
              name={icon}
              size={isSmall ? 15 : isLarge ? 20 : 18}
              color={textColor}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.text,
              { color: textColor },
              isSmall && styles.textSm,
              isLarge && styles.textLg,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btnSm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.sm,
  },
  btnLg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  textSm: {
    fontSize: 13,
    fontWeight: '600',
  },
  textLg: {
    fontSize: 17,
    fontWeight: '700',
  },
});
