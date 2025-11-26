import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Clipboard } from 'react-native';
import { useParking } from '../hooks/useParking';

export default function PaymentScreen({ route, setView }) {
  const { vehicleInfo } = route?.params || {};
  const { unparkVehicle } = useParking();
  const [paymentMethod, setPaymentMethod] = useState(null); // 'pix' ou 'card'
  const [pixGenerated, setPixGenerated] = useState(false);
  const [pixCode, setPixCode] = useState('');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  if (!vehicleInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: Informações de pagamento não encontradas</Text>
        <TouchableOpacity onPress={() => setView('dashboard')} style={styles.button}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleGeneratePix = () => {
    // Gerar código PIX aleatório (em produção, usar API de pagamento)
    const code = `00020126580014BR.GOV.BCB.PIX0136${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setPixCode(code);
    setPixGenerated(true);
  };

  const handleCopyPixCode = () => {
    Clipboard.setString(pixCode);
    Alert.alert('Copiado!', 'Código PIX copiado para a área de transferência');
  };

  const handleConfirmPixPayment = async () => {
    // Em produção, verificar o pagamento com a API
    const result = await unparkVehicle(vehicleInfo.plate);
    if (result.success) {
      Alert.alert(
        'Pagamento Confirmado!',
        'A cancela será liberada em instantes.',
        [{ text: 'OK', onPress: () => setView('dashboard') }]
      );
    } else {
      Alert.alert('Erro', result.message || 'Erro ao processar saída');
    }
  };

  const handleCardPayment = async () => {
    if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
      Alert.alert('Atenção', 'Preencha todos os dados do cartão');
      return;
    }

    // Em produção, processar pagamento com API (Stripe, Mercado Pago, etc)
    const result = await unparkVehicle(vehicleInfo.plate);
    if (result.success) {
      Alert.alert(
        'Pagamento Aprovado!',
        'Seu pagamento foi processado. A cancela será liberada.',
        [{ text: 'OK', onPress: () => setView('dashboard') }]
      );
    } else {
      Alert.alert('Erro', result.message || 'Erro ao processar pagamento');
    }
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\//g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setView('exit')}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Pagamento</Text>
      </View>

      <View style={styles.content}>
        {/* Resumo do Pagamento */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumo</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Placa:</Text>
            <Text style={styles.summaryValue}>{vehicleInfo.plate}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Vaga:</Text>
            <Text style={styles.summaryValue}>{vehicleInfo.spaceId}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tempo:</Text>
            <Text style={styles.summaryValue}>{vehicleInfo.stayDuration}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total a Pagar:</Text>
            <Text style={styles.totalValue}>{vehicleInfo.cost}</Text>
          </View>
        </View>

        {/* Seleção de Método de Pagamento */}
        {!paymentMethod && (
          <View style={styles.methodsContainer}>
            <Text style={styles.methodsTitle}>Escolha a forma de pagamento:</Text>
            
            <TouchableOpacity 
              style={styles.methodButton}
              onPress={() => setPaymentMethod('pix')}
            >
              <Text style={styles.methodIcon}>📱</Text>
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>PIX</Text>
                <Text style={styles.methodDesc}>Pagamento instantâneo</Text>
              </View>
              <Text style={styles.methodArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.methodButton}
              onPress={() => setPaymentMethod('card')}
            >
              <Text style={styles.methodIcon}>💳</Text>
              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>Cartão de Crédito/Débito</Text>
                <Text style={styles.methodDesc}>Pagamento seguro</Text>
              </View>
              <Text style={styles.methodArrow}>→</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Pagamento PIX */}
        {paymentMethod === 'pix' && !pixGenerated && (
          <View style={styles.pixContainer}>
            <Text style={styles.pixTitle}>Pagamento via PIX</Text>
            <Text style={styles.pixDescription}>
              Clique no botão abaixo para gerar o código PIX
            </Text>
            <TouchableOpacity 
              style={styles.generatePixButton}
              onPress={handleGeneratePix}
            >
              <Text style={styles.generatePixText}>Gerar QR Code PIX</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPaymentMethod(null)}>
              <Text style={styles.changeMethodText}>Alterar forma de pagamento</Text>
            </TouchableOpacity>
          </View>
        )}

        {pixGenerated && (
          <View style={styles.pixContainer}>
            <Text style={styles.pixTitle}>Escaneie o QR Code</Text>
            <View style={styles.qrCodeContainer}>
              <Text style={styles.qrCodePlaceholder}>📱</Text>
              <Text style={styles.qrCodeText}>QR CODE PIX</Text>
            </View>
            <View style={styles.pixCodeContainer}>
              <Text style={styles.pixCodeLabel}>Código PIX Copia e Cola:</Text>
              <Text style={styles.pixCode}>
                {pixCode}
              </Text>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopyPixCode}>
                <Text style={styles.copyButtonText}>📋 Copiar Código</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.pixInstructions}>
              Após realizar o pagamento, clique no botão abaixo para liberar a cancela.
            </Text>
            <TouchableOpacity 
              style={styles.confirmPaymentButton}
              onPress={handleConfirmPixPayment}
            >
              <Text style={styles.confirmPaymentText}>✓ Já Paguei</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Pagamento com Cartão */}
        {paymentMethod === 'card' && (
          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Dados do Cartão</Text>
            
            <Text style={styles.inputLabel}>Número do Cartão</Text>
            <TextInput
              style={styles.input}
              placeholder="0000 0000 0000 0000"
              keyboardType="numeric"
              maxLength={19}
              value={cardData.number}
              onChangeText={(text) => setCardData({...cardData, number: formatCardNumber(text)})}
            />

            <Text style={styles.inputLabel}>Nome no Cartão</Text>
            <TextInput
              style={styles.input}
              placeholder="NOME COMPLETO"
              autoCapitalize="characters"
              value={cardData.name}
              onChangeText={(text) => setCardData({...cardData, name: text.toUpperCase()})}
            />

            <View style={styles.cardRow}>
              <View style={styles.cardHalf}>
                <Text style={styles.inputLabel}>Validade</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/AA"
                  keyboardType="numeric"
                  maxLength={5}
                  value={cardData.expiry}
                  onChangeText={(text) => setCardData({...cardData, expiry: formatExpiry(text)})}
                />
              </View>
              <View style={styles.cardHalf}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                  value={cardData.cvv}
                  onChangeText={(text) => setCardData({...cardData, cvv: text})}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.payButton}
              onPress={handleCardPayment}
            >
              <Text style={styles.payButtonText}>💳 Pagar {vehicleInfo.cost}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setPaymentMethod(null)}>
              <Text style={styles.changeMethodText}>Alterar forma de pagamento</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#22c55e',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    margin: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#111827',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  methodsContainer: {
    marginBottom: 20,
  },
  methodsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#111827',
  },
  methodButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  methodIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5,
  },
  methodDesc: {
    fontSize: 14,
    color: '#6b7280',
  },
  methodArrow: {
    fontSize: 24,
    color: '#9ca3af',
  },
  pixContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  pixTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
  },
  pixDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  generatePixButton: {
    backgroundColor: '#00a884',
    padding: 18,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  generatePixText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qrCodeContainer: {
    width: 250,
    height: 250,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  qrCodePlaceholder: {
    fontSize: 80,
  },
  qrCodeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
    marginTop: 10,
  },
  pixCodeContainer: {
    width: '100%',
    marginBottom: 20,
  },
  pixCodeLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#111827',
  },
  pixCode: {
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 8,
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#111827',
    marginBottom: 10,
  },
  copyButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pixInstructions: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmPaymentButton: {
    backgroundColor: '#22c55e',
    padding: 18,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  confirmPaymentText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111827',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHalf: {
    width: '48%',
  },
  payButton: {
    backgroundColor: '#22c55e',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  changeMethodText: {
    fontSize: 14,
    color: '#3b82f6',
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
