import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
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

interface RouteMapCardProps {
  route: RouteCoordinates;
}

export const RouteMapCard: React.FC<RouteMapCardProps> = ({ route }) => {
  const handleOpenGoogleMaps = async () => {
    const origin = `${route.originCoords.lat},${route.originCoords.lng}`;
    const destination = `${route.destCoords.lat},${route.destCoords.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Navigation', 'Impossible d\'ouvrir Google Maps.');
    }
  };

  const handleCall = (phone?: string) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`).catch(() => {});
  };

  const handleWhatsApp = (phone?: string, name?: string) => {
    if (!phone) return;
    const clean = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Bonjour ${name || 'Chauffeur'}, je vous contacte depuis AgriDirect Cameroun concernant votre livraison.`
    );
    Linking.openURL(`https://wa.me/${clean}?text=${msg}`).catch(() => {});
  };

  // Build Google Maps Embed URL - shows the route with directions
  const midLat = (route.originCoords.lat + route.destCoords.lat) / 2;
  const midLng = (route.originCoords.lng + route.destCoords.lng) / 2;

  const mapHtml = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0F172A; width: 100%; height: 100%; }
    #map { width: 100%; height: 100vh; }
    .loading { display: flex; align-items: center; justify-content: center; height: 100vh; color: #94a3b8; font-family: sans-serif; font-size: 14px; }
  </style>
</head>
<body>
  <iframe
    id="map"
    frameborder="0"
    style="border:0; width:100%; height:100vh;"
    src="https://maps.google.com/maps?q=${midLat},${midLng}&z=8&output=embed&hl=fr&t=k"
    allowfullscreen>
  </iframe>
</body>
</html>`;

  return (
    <View style={[styles.card, Shadows.md]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.badgeText}>SUIVI GPS EN TEMPS RÉEL</Text>
        </View>
        <Text style={styles.distanceText}>
          {route.distanceKm} km • ~{route.durationEst}
        </Text>
      </View>

      {/* Route Labels */}
      <View style={styles.routeLabelsRow}>
        <View style={styles.routePoint}>
          <View style={styles.dotGreen} />
          <Text style={styles.routePointText} numberOfLines={1}>{route.originName}</Text>
        </View>
        <View style={styles.routeArrow}>
          <Ionicons name="arrow-forward" size={16} color={Colors.textMuted} />
        </View>
        <View style={styles.routePoint}>
          <View style={styles.dotRed} />
          <Text style={styles.routePointText} numberOfLines={1}>{route.destName}</Text>
        </View>
      </View>

      {/* Embedded Google Map */}
      <View style={styles.mapContainer}>
        <WebView
          source={{ html: mapHtml }}
          style={styles.map}
          scrollEnabled={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.mapLoading}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.mapLoadingText}>Chargement de la carte...</Text>
            </View>
          )}
          onError={() => {}}
        />

        {/* Checkpoint badge overlay */}
        {route.currentCheckpoint && (
          <View style={styles.checkpointBadge}>
            <Ionicons name="navigate" size={12} color="#FFFFFF" />
            <Text style={styles.checkpointText} numberOfLines={1}>
              {route.currentCheckpoint}
            </Text>
          </View>
        )}

        {/* Open in Maps button */}
        <TouchableOpacity style={styles.openMapsBtn} onPress={handleOpenGoogleMaps}>
          <Ionicons name="open-outline" size={14} color={Colors.primary} />
          <Text style={styles.openMapsText}>Ouvrir dans Maps</Text>
        </TouchableOpacity>
      </View>

      {/* Corridor info */}
      <View style={styles.corridorRow}>
        <Ionicons name="git-branch-outline" size={14} color={Colors.textSecondary} />
        <Text style={styles.corridorText} numberOfLines={1}>{route.corridor}</Text>
      </View>

      {/* Driver actions */}
      {(route.driverName || route.vehiclePlate) && (
        <View style={styles.driverRow}>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{route.driverName}</Text>
            <Text style={styles.vehiclePlate}>{route.vehiclePlate}</Text>
          </View>
          <View style={styles.driverActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleCall(route.driverPhone)}
            >
              <Ionicons name="call-outline" size={16} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.whatsappBtn]}
              onPress={() => handleWhatsApp(route.driverPhone, route.driverName)}
            >
              <Ionicons name="logo-whatsapp" size={16} color="#16A34A" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#22C55E',
    letterSpacing: 0.5,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  routeLabelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 8,
  },
  routePoint: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dotGreen: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
  },
  dotRed: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },
  routePointText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  routeArrow: {
    paddingHorizontal: 4,
  },
  mapContainer: {
    height: 220,
    backgroundColor: '#0F172A',
    position: 'relative',
  },
  map: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  mapLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    gap: 8,
  },
  mapLoadingText: {
    color: '#94a3b8',
    fontSize: 13,
  },
  checkpointBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15,23,42,0.85)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  checkpointText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
    maxWidth: 200,
  },
  openMapsBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  openMapsText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '700',
  },
  corridorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  corridorText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  vehiclePlate: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  driverActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappBtn: {
    backgroundColor: '#DCFCE7',
  },
});
