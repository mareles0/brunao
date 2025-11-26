import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function SplashScreen({ onStart }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>🚗</Text>
        <Text style={styles.title}>
          Estacione <Text style={styles.titleHighlight}>Fácil</Text>
        </Text>
        <Text style={styles.subtitle}>Sua vaga inteligente espera por você</Text>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={onStart}>
        <Text style={styles.buttonText}>Acessar Vagas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    paddingHorizontal: 30,
    paddingVertical: 50,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  titleHighlight: {
    color: '#3b82f6',
  },
  subtitle: {
    fontSize: 18,
    color: '#9ca3af',
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 20,
    borderRadius: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
