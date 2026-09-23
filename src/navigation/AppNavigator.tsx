import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Colors, Shadows } from '../theme/theme';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import FarmerDashboardScreen from '../screens/farmer/FarmerDashboardScreen';
import FarmerProduceScreen from '../screens/farmer/FarmerProduceScreen';
import AddProduceScreen from '../screens/farmer/AddProduceScreen';
import BuyerDashboardScreen from '../screens/buyer/BuyerDashboardScreen';
import BuyerBrowseScreen from '../screens/buyer/BuyerBrowseScreen';
import DeliveryDashboardScreen from '../screens/delivery/DeliveryDashboardScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabScreenOptions = {
  tabBarActiveTintColor: Colors.primary,
  tabBarInactiveTintColor: Colors.textMuted,
  tabBarStyle: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 62,
    paddingBottom: 8,
    paddingTop: 6,
    ...Shadows.md,
  },
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  headerShown: false,
};

const FarmerTabs = () => {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="Dashboard"
        component={FarmerDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'stats-chart' : 'stats-chart-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="My Produce"
        component={FarmerProduceScreen}
        options={{
          tabBarLabel: 'Mes Produits',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'leaf' : 'leaf-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const BuyerTabs = () => {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="Dashboard"
        component={BuyerDashboardScreen}
        options={{
          tabBarLabel: 'My Orders',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'receipt' : 'receipt-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Browse"
        component={BuyerBrowseScreen}
        options={{
          tabBarLabel: 'Marketplace',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'storefront' : 'storefront-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const commonStackOptions = {
  headerStyle: {
    backgroundColor: Colors.surface,
  },
  headerTintColor: Colors.primaryDark,
  headerTitleStyle: {
    fontWeight: '700' as const,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  headerShadowVisible: false,
};

export const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <Stack.Navigator screenOptions={commonStackOptions}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            title: 'Create Account',
            headerBackTitle: 'Back',
          }}
        />
      </Stack.Navigator>
    );
  }

  if (user.role === 'farmer') {
    return (
      <Stack.Navigator screenOptions={commonStackOptions}>
        <Stack.Screen name="FarmerTabs" component={FarmerTabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="AddProduce"
          component={AddProduceScreen}
          options={{
            title: 'Ajouter un Produit',
            headerBackTitle: 'Annuler',
          }}
        />
      </Stack.Navigator>
    );
  }

  if (user.role === 'buyer') {
    return (
      <Stack.Navigator screenOptions={commonStackOptions}>
        <Stack.Screen name="BuyerTabs" component={BuyerTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  if (user.role === 'delivery') {
    return (
      <Stack.Navigator screenOptions={commonStackOptions}>
        <Stack.Screen
          name="Delivery"
          component={DeliveryDashboardScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  if (user.role === 'admin') {
    return (
      <Stack.Navigator screenOptions={commonStackOptions}>
        <Stack.Screen
          name="Admin"
          component={AdminDashboardScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={commonStackOptions}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};
