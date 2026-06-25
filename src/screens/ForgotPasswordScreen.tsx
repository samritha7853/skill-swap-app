import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const handleSendLink = () => {
    if (!email) {
      Alert.alert('Error', 'Enter your email address.');
      return;
    }
    Alert.alert('Link Sent', 'Check your email for password reset instructions.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <InputField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <CustomButton title="Send Reset Link" onPress={handleSendLink} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F7F7FA',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
});
