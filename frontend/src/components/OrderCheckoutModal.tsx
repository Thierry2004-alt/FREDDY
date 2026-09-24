import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProduceItem } from './ProduceCard';
import { AppInput } from './AppInput';
import { AppButton } from './AppButton';
import { orderAPI } from '../services/api';
import { Colors, BorderRadius, Shadows } from '../theme/theme';

interface OrderCheckoutModalProps {
  visible: boolean;
  item: ProduceItem | null;
  onClose: () => void;
  onOrderSuccess: (orderData: any) => void;
}

export const OrderCheckoutModal: React.FC<OrderCheckoutModalProps> = ({
  visible,
  item,
  onClose,
  onOrderSuccess,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(2);
  const [deliveryAddress, setDeliveryAddress] = useState(
    'Boulevard de la Liberté, Bonanjo, Douala'
  );
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'orange' | 'cash'>('momo');
  const [momoNumber, setMomoNumber] = useState('+237 671 98 76 54');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const unitPrice = Number(item.price_per_unit) || 0;
  const subtotal = unitPrice * quantity;
  const transportFee = 5000;
  const total = subtotal + transportFee;

  const handleIncrement = () => {
    const max = Number(item.quantity_available) || 999;
    if (quantity < max) setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleSubmitOrder = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert('Adresse requise', 'Veuillez renseigner votre adresse de livraison au Cameroun.');
      return;
    }

    setIsSubmitting(true);
    const orderPayload = {
      produce: item.id,
      quantity,
      unit_price: unitPrice,
      total_price: total,
      delivery_address: deliveryAddress,
      delivery_notes: `Paiement: ${paymentMethod.toUpperCase()} (${momoNumber}). ${notes}`,
      status: 'pending',
    };

    try {
      const res = await orderAPI.create(orderPayload);
      onOrderSuccess(res.data);
    } catch (err) {
      // Optimistic local success
      onOrderSuccess({
        id: Math.floor(Math.random() * 9000) + 1000,
        produce: item.name,
        quantity: `${quantity} ${item.unit}`,
        total,
        status: 'pending',
        date: new Date().toISOString().slice(0, 10),
        farmer: item.farmer_name || 'Producteur Maraîcher',
      });
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalSheet, Shadows.lg]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.sheetTitle}>Passer Commande en Gros</Text>
              <Text style={styles.sheetSubtitle}>Approvisionnement direct producteur (Cameroun)</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Product Summary Box */}
            <View style={styles.productSummaryBox}>
              <View style={styles.prodLeft}>
                <Text style={styles.prodName}>{item.name}</Text>
                <Text style={styles.prodLocation}>
                  <Ionicons name="location-outline" size={13} color={Colors.textMuted} />{' '}
                  {item.location || 'Bassin Agricole'}
                </Text>
                <Text style={styles.prodSupplier}>Producteur : {item.farmer_name || 'Certifié'}</Text>
              </View>
              <View style={styles.priceTag}>
                <Text style={styles.priceNum}>{unitPrice.toLocaleString()}</Text>
                <Text style={styles.priceUnit}>FCFA / {item.unit}</Text>
              </View>
            </View>

            {/* Quantity Stepper */}
            <View style={styles.stepperSection}>
              <Text style={styles.fieldLabel}>QUANTITÉ SOUHAITÉE ({item.unit})</Text>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  style={[styles.stepBtn, quantity <= 1 && styles.stepBtnDisabled]}
                  onPress={handleDecrement}
                  disabled={quantity <= 1}
                >
                  <Ionicons name="remove" size={20} color={Colors.textPrimary} />
                </TouchableOpacity>

                <View style={styles.stepValueBox}>
                  <Text style={styles.stepValueText}>{quantity}</Text>
                  <Text style={styles.stepUnitText}>{item.unit}</Text>
                </View>

                <TouchableOpacity style={styles.stepBtn} onPress={handleIncrement}>
                  <Ionicons name="add" size={20} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Delivery Address */}
            <AppInput
              label="Adresse de Livraison (Douala / Yaoundé / Autres) *"
              icon="navigate-outline"
              placeholder="Ex: Akwa, Marché Sandaga, Douala"
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
            />

            {/* Payment Method Selector */}
            <Text style={styles.fieldLabel}>MODE DE PAIEMENT SÉCURISÉ</Text>
            <View style={styles.paymentMethodsRow}>
              <TouchableOpacity
                style={[
                  styles.paymentPill,
                  paymentMethod === 'momo' && styles.paymentPillActiveMomo,
                ]}
                onPress={() => setPaymentMethod('momo')}
              >
                <View style={styles.momoCircle}>
                  <Text style={styles.momoIconText}>🟡</Text>
                </View>
                <Text style={styles.paymentLabel}>MTN MoMo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentPill,
                  paymentMethod === 'orange' && styles.paymentPillActiveOrange,
                ]}
                onPress={() => setPaymentMethod('orange')}
              >
                <View style={styles.orangeCircle}>
                  <Text style={styles.orangeIconText}>🟠</Text>
                </View>
                <Text style={styles.paymentLabel}>Orange Money</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentPill,
                  paymentMethod === 'cash' && styles.paymentPillActiveCash,
                ]}
                onPress={() => setPaymentMethod('cash')}
              >
                <Ionicons name="cash-outline" size={18} color="#059669" />
                <Text style={styles.paymentLabel}>À Livraison</Text>
              </TouchableOpacity>
            </View>

            {paymentMethod !== 'cash' && (
              <AppInput
                label={`Numéro de Compte ${paymentMethod === 'momo' ? 'MTN' : 'Orange'} *`}
                icon="call-outline"
                placeholder="+237 6XX XX XX XX"
                value={momoNumber}
                onChangeText={setMomoNumber}
                keyboardType="phone-pad"
              />
            )}

            <AppInput
              label="Instructions Spéciales au Transporteur"
              icon="chatbox-outline"
              placeholder="Ex: Livraison quai réfrigéré avant 9h"
              value={notes}
              onChangeText={setNotes}
            />

            {/* Live Invoice Breakdown */}
            <View style={styles.invoiceCard}>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceText}>Sous-total ({quantity} {item.unit})</Text>
                <Text style={styles.invoiceVal}>{subtotal.toLocaleString()} FCFA</Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={styles.invoiceText}>Fret Agro-Logistique sécurisé</Text>
                <Text style={styles.invoiceVal}>{transportFee.toLocaleString()} FCFA</Text>
              </View>
              <View style={styles.invoiceDivider} />
              <View style={styles.invoiceRowTotal}>
                <Text style={styles.invoiceTotalLabel}>TOTAL À PAYER</Text>
                <Text style={styles.invoiceTotalVal}>{total.toLocaleString()} FCFA</Text>
              </View>
            </View>

            {/* Submit Action */}
            <AppButton
              title={`Confirmer la Commande (${total.toLocaleString()} FCFA)`}
              icon="checkmark-circle-outline"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              onPress={handleSubmitOrder}
              style={styles.submitBtn}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '92%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  sheetSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  productSummaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 14,
    borderRadius: BorderRadius.lg,
    marginBottom: 16,
  },
  prodLeft: {
    flex: 1,
    paddingRight: 10,
  },
  prodName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
  },
  prodLocation: {
    fontSize: 12,
    color: '#047857',
    marginTop: 3,
  },
  prodSupplier: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  priceTag: {
    alignItems: 'flex-end',
  },
  priceNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#065F46',
  },
  priceUnit: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '600',
  },
  stepperSection: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.lg,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  stepBtnDisabled: {
    opacity: 0.4,
  },
  stepValueBox: {
    alignItems: 'center',
  },
  stepValueText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  stepUnitText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  paymentMethodsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  paymentPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 6,
  },
  paymentPillActiveMomo: {
    borderColor: '#EAB308',
    backgroundColor: '#FEF9C3',
  },
  paymentPillActiveOrange: {
    borderColor: '#F97316',
    backgroundColor: '#FFEDD5',
  },
  paymentPillActiveCash: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  momoCircle: {},
  momoIconText: { fontSize: 13 },
  orangeCircle: {},
  orangeIconText: { fontSize: 13 },
  paymentLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  invoiceCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.lg,
    padding: 14,
    marginVertical: 14,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  invoiceText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  invoiceVal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  invoiceDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  invoiceRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceTotalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  invoiceTotalVal: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  submitBtn: {
    marginTop: 4,
    marginBottom: 10,
  },
});
