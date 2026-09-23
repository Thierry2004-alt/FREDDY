import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
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
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(`https://maps.google.com/?q=${destination}`);
      }
    } catch (err) {
      Alert.alert('Navigation', 'Opening Google Maps route...');
      Linking.openURL(url);
    }
  };

  const handleCall = (phone?: string) => {
    if (!phone) return;
    const cleanNumber = phone.replace(/\s+/g, '');
    Linking.openURL(`tel:${cleanNumber}`).catch(() => {
      Alert.alert('Phone Call', `Dialing ${phone}`);
    });
  };

  const handleWhatsApp = (phone?: string, name?: string) => {
    if (!phone) return;
    const cleanNumber = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Bonjour ${name || 'Chauffeur'}, je vous contacte depuis la plateforme AgriDirect Cameroun concernant le transport de notre cargaison.`
    );
    const url = `https://wa.me/${cleanNumber}?text=${message}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('WhatsApp', `Cannot open WhatsApp for ${phone}`);
    });
  };

  return (
    <View style={[styles.card, Shadows.md]}>
      {/* Map Header Header */}
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.badgeText}>SUIVI GPS EN TEMPS RÉEL</Text>
        </View>
        <Text style={styles.distanceText}>
          {route.distanceKm} km • ~{route.durationEst}
        </Text>
      </View>

      {/* Styled Route Graphical Simulation */}
      <View style={styles.mapCanvas}>
        {/* Stylized background terrain contours */}
        <View style={styles.mapGridLines}>
          <View style={styles.roadStripe} />
        </View>

        {/* Origin Pin */}
        <View style={styles.originPinWrapper}>
          <View style={styles.pinOrigin}>
            <Ionicons name="leaf" size={14} color={Colors.textWhite} />
          </View>
          <Text style={styles.pinLabel}>{route.originName}</Text>
        </View>

        {/* Live Truck Marker in transit */}
        <View style={styles.truckMarkerWrapper}>
          <View style={styles.truckBadge}>
            <Ionicons name="cube" size={16} color={Colors.textWhite} />
          </View>
          <View style={styles.truckLabelBox}>
            <Text style={styles.truckPlate}>{route.vehiclePlate || 'LT-4829-NW'}</Text>
            <Text style={styles.truckSpeed}>En route • 62 km/h</Text>
          </View>
        </View>

        {/* Destination Pin */}
        <View style={styles.destPinWrapper}>
          <View style={styles.pinDest}>
            <Ionicons name="business" size={14} color={Colors.textWhite} />
          </View>
          <Text style={styles.pinLabel}>{route.destName}</Text>
        </View>
      </View>

      {/* Corridor & Checkpoint details */}
      <View style={styles.infoSection}>
        <View style={styles.corridorRow}>
          <Ionicons name="git-branch-outline" size={16} color={Colors.primary} />
          <Text style={styles.corridorText}>Axe : {route.corridor}</Text>
        </View>
        {route.currentCheckpoint && (
          <View style={styles.checkpointRow}>
            <Ionicons name="navigate-outline" size={14} color={Colors.secondary} />
            <Text style={styles.checkpointText}>
              Point de contrôle actuel : <Text style={styles.boldText}>{route.currentCheckpoint}</Text>
            </Text>
          </View>
        )}
      </View>

      {/* Actions Row: Google Maps & Direct Communications */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.googleMapsBtn}
          onPress={handleOpenGoogleMaps}
          activeOpacity={0.8}
        >
          <Ionicons name="map-outline" size={18} color={Colors.textWhite} />
          <Text style={styles.googleMapsBtnText}>Ouvrir dans Google Maps</Text>
        </TouchableOpacity>

        {route.driverPhone && (
          <View style={styles.contactButtonsRow}>
            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => handleCall(route.driverPhone)}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={16} color="#059669" />
              <Text style={styles.callBtnText}>Appeler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.whatsappBtn}
              onPress={() => handleWhatsApp(route.driverPhone, route.driverName)}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-whatsapp" size={16} color="#16A34A" />
              <Text style={styles.whatsappBtnText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.6,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  mapCanvas: {
    height: 120,
    backgroundColor: '#0F172A',
    borderRadius: BorderRadius.lg,
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  mapGridLines: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
  },
  roadStripe: {
    height: 6,
    backgroundColor: '#334155',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#475569',
    borderStyle: 'dashed',
  },
  originPinWrapper: {
    position: 'absolute',
    left: 14,
    top: 24,
    alignItems: 'center',
  },
  pinOrigin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  destPinWrapper: {
    position: 'absolute',
    right: 14,
    bottom: 24,
    alignItems: 'center',
  },
  pinDest: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#BFDBFE',
  },
  pinLabel: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  truckMarkerWrapper: {
    position: 'absolute',
    left: '46%',
    top: 28,
    alignItems: 'center',
  },
  truckBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FDE68A',
  },
  truckLabelBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
    alignItems: 'center',
  },
  truckPlate: {
    color: '#FBBF24',
    fontSize: 9,
    fontWeight: '800',
  },
  truckSpeed: {
    color: '#94A3B8',
    fontSize: 8,
  },
  infoSection: {
    paddingVertical: 10,
    gap: 4,
  },
  corridorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  corridorText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  checkpointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkpointText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  boldText: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  actionsContainer: {
    marginTop: 6,
    gap: 8,
  },
  googleMapsBtn: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
    gap: 8,
  },
  googleMapsBtnText: {
    color: Colors.textWhite,
    fontSize: 13,
    fontWeight: '700',
  },
  contactButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingVertical: 9,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  callBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  whatsappBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    paddingVertical: 9,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  whatsappBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
});
