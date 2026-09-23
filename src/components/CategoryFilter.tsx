import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '../theme/theme';

export interface CategoryItem {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const CATEGORIES: CategoryItem[] = [
  { id: '', name: 'All Items', icon: 'grid-outline' },
  { id: 'vegetables', name: 'Vegetables', icon: 'leaf-outline' },
  { id: 'fruits', name: 'Fruits', icon: 'nutrition-outline' },
  { id: 'grains', name: 'Grains & Cereals', icon: 'basket-outline' },
  { id: 'tubers', name: 'Tubers & Roots', icon: 'earth-outline' },
  { id: 'legumes', name: 'Legumes', icon: 'ellipse-outline' },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id || 'all'}
              onPress={() => onSelectCategory(cat.id)}
              activeOpacity={0.7}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
              ]}
            >
              <Ionicons
                name={cat.icon}
                size={16}
                color={isSelected ? Colors.textWhite : Colors.textSecondary}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.chipText,
                  isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
  },
  chipUnselected: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: Colors.textWhite,
  },
  chipTextUnselected: {
    color: Colors.textSecondary,
  },
});
