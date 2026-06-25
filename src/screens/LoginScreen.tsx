import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Image source={require('./assets/image/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Skill Swap</Text>
      <InputField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <InputField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <CustomButton title="Login" onPress={() => navigation.navigate('Home')} />
      <View style={styles.footerRow}>
        <Text style={styles.footerLink} onPress={() => navigation.navigate('Signup')}>
          Sign Up
        </Text>
        <Text style={styles.footerLink} onPress={() => navigation.navigate('ForgotPassword')}>
          Forgot Password?
        </Text>
      </View>
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
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  footerRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
