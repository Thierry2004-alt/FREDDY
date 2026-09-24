import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
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

interface LeafletMapViewProps {
  route: RouteCoordinates;
}

export const LeafletMapView: React.FC<LeafletMapViewProps> = ({ route }) => {
  const origin = route.originCoords;
  const destination = route.destCoords;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #map { width: 100%; height: 100%; }
        .custom-marker {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          color: white;
          font-weight: bold;
          font-size: 16px;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .marker-origin { background-color: #059669; }
        .marker-destination { background-color: #DC2626; }
        .marker-truck { background-color: #2563EB; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {
          zoomControl: false,
          attributionControl: false
        }).setView([${(origin.lat + destination.lat) / 2}, ${(origin.lng + destination.lng) / 2}], 9);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);

        var originIcon = L.divIcon({
          className: 'custom-marker marker-origin',
          html: '📍',
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        var destIcon = L.divIcon({
          className: 'custom-marker marker-destination',
          html: '🏁',
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        var truckIcon = L.divIcon({
          className: 'custom-marker marker-truck',
          html: '🚚',
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        L.marker([${origin.lat}, ${origin.lng}], { icon: originIcon })
          .addTo(map)
          .bindPopup('<b>${route.originName}</b><br>Origin');

        L.marker([${destination.lat}, ${destination.lng}], { icon: destIcon })
          .addTo(map)
          .bindPopup('<b>${route.destName}</b><br>Destination');

        L.marker([${(origin.lat + destination.lat) / 2}, ${(origin.lng + destination.lng) / 2}], { icon: truckIcon })
          .addTo(map)
          .bindPopup('<b>${route.vehiclePlate || 'Truck'}</b><br>Transporter');

        var polyline = L.polyline([
          [${origin.lat}, ${origin.lng}],
          [${(origin.lat + destination.lat) / 2}, ${(origin.lng + destination.lng) / 2}],
          [${destination.lat}, ${destination.lng}]
        ], {
          color: '#2563EB',
          weight: 4,
          opacity: 0.8
        }).addTo(map);

        setTimeout(function() {
          map.invalidateSize();
        }, 500);
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.wrapper}>
      <WebView
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        mixedContentMode="always"
        onError={(syntheticEvent) => {
          console.log('WebView error: ', syntheticEvent.nativeEvent);
        }}
      />
      <View style={styles.mapOverlayBadge}>
        <Text style={styles.mapOverlayTitle}>LIVE TRACKING</Text>
        <Text style={styles.mapOverlaySub}>{route.distanceKm} km • ~{route.durationEst}</Text>
      </View>
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
  webview: {
    backgroundColor: '#E5E7EB',
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
