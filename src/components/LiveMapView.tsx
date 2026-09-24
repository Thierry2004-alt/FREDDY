import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Colors, BorderRadius, Shadows } from '../theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_HEIGHT = 220;

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
    latitude: (origin.latitude + destination.latitude) / 2,
    longitude: (origin.longitude + destination.longitude) / 2,
    latitudeDelta: Math.abs(origin.latitude - destination.latitude) * 1.6 || 2.5,
    longitudeDelta: Math.abs(origin.longitude - destination.longitude) * 1.6 || 2.5,
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
        <Marker coordinate={{ latitude: origin.latitude, longitude: origin.longitude }} title={route.originName} description="Origin" />
        <Marker coordinate={{ latitude: destination.latitude, longitude: destination.longitude }} title={route.destName} description="Destination" />
        <Marker coordinate={{ latitude: truck.latitude, longitude: truck.longitude }} title={route.vehiclePlate || 'Truck'} description="Transporter" />
        <Polyline
          coordinates={[
            { latitude: origin.latitude, longitude: origin.longitude },
            { latitude: truck.latitude, longitude: truck.longitude },
            { latitude: destination.latitude, longitude: destination.longitude },
          ]}
          strokeColor={Colors.primary}
          strokeWidth={3}
        />
      </MapView>

      <View style={styles.mapOverlayBadge}>
        <Text style={styles.mapOverlayTitle}>LIVE TRACKING</Text>
        <Text style={styles.mapOverlaySub}>{route.distanceKm} km • ~{route.durationEst}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: MAP_HEIGHT,
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
