import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors, BorderRadius, Shadows } from '../theme/theme';

export interface RouteCoordinates {
  originName: string;
  originCoords: { lat: number; lng: number };
  destName: string;
  destCoords: { lat: number; lng: number };
  distanceKm: number;
  durationEst: string;
  corridor: string;
  vehiclePlate?: string;
  driverName?: string;
  driverPhone?: string;
  currentCheckpoint?: string;
}

interface LiveMapViewProps {
  route: RouteCoordinates;
  currentAgentCoords?: { lat: number; lng: number } | null;
}

export const LiveMapView: React.FC<LiveMapViewProps> = ({ route, currentAgentCoords = null }) => {
  const origin = route.originCoords;
  const destination = route.destCoords;
  const truck = currentAgentCoords || { lat: (origin.lat + destination.lat) / 2, lng: (origin.lng + destination.lng) / 2 };

  const region = {
    latitude: (origin.lat + destination.lat) / 2,
    longitude: (origin.lng + destination.lng) / 2,
    latitudeDelta: Math.abs(origin.lat - destination.lat) * 1.6 || 2.5,
    longitudeDelta: Math.abs(origin.lng - destination.lng) * 1.6 || 2.5,
  };

  const openExternalMap = async () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(`https://maps.google.com/?q=${destination.lat},${destination.lng}`);
      }
    } catch (err) {
      Alert.alert('Navigation', 'Opening Google Maps route...');
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.wrapper}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        loadingEnabled
        liteMode
      >
        <Marker coordinate={{ latitude: origin.lat, longitude: origin.lng }} title={route.originName} description="Origin" />
        <Marker coordinate={{ latitude: destination.lat, longitude: destination.lng }} title={route.destName} description="Destination" />
        <Marker coordinate={{ latitude: truck.lat, longitude: truck.lng }} title={route.vehiclePlate || 'Truck'} description="Transporter" />
        <Polyline
          coordinates={[
            { latitude: origin.lat, longitude: origin.lng },
            { latitude: truck.lat, longitude: truck.lng },
            { latitude: destination.lat, longitude: destination.lng },
          ]}
          strokeColor={Colors.primary}
          strokeWidth={3}
        />
      </MapView>

      <TouchableOpacity style={styles.mapOverlayBadge} onPress={openExternalMap} activeOpacity={0.85}>
        <Ionicons name="map-outline" size={12} color="#A7F3D0" />
        <Text style={styles.mapOverlayTitle}>LIVE TRACKING</Text>
        <Text style={styles.mapOverlaySub}>{route.distanceKm} km • ~{route.durationEst}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 220,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  mapOverlayBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(15,23,42,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  mapOverlayTitle: {
    color: '#A7F3D0',
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.8,
  },
  mapOverlaySub: {
    color: '#E2E8F0',
    fontWeight: '700',
    fontSize: 11,
    marginTop: 2,
  },
});
