import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { LIGHT_THEME, DARK_THEME } from '../constants/theme';
import { authService } from '../services/authService';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';

export default function SignupScreen({ navigation }: any) {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Error States for validation
  const [errors, setErrors] = useState<any>({});
  const [registering, setRegistering] = useState(false);

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        return;
      }
      const uri = response.assets?.[0]?.uri;
      if (uri) {
        setProfileImage(uri);
      }
    });
  };

  const validateForm = () => {
    const tempErrors: any = {};
    if (!fullName.trim()) tempErrors.fullName = 'Full name is required';
    if (!username.trim()) tempErrors.username = 'Username is required';
    
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      tempErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setRegistering(true);
      await authService.signUp(
        email.trim(),
        password,
        fullName.trim(),
        username.trim(),
        profileImage || undefined
      );

      Alert.alert('Welcome!', 'Your account has been created. Let\'s swap some skills!', [
        { text: 'Let\'s Go', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (e: any) {
      Alert.alert('Registration Failed', e.message || 'An error occurred during sign up.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Create Account</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Join the SkillSwap community</Text>

      {/* Profile Image Picker */}
      <View style={styles.imageSection}>
        <TouchableOpacity style={[styles.imageFrame, { borderColor: theme.colors.border }]} onPress={handlePickImage} activeOpacity={0.8}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.selectedImage} />
          ) : (
            <View style={styles.placeholderFrame}>
              <Icon name="camera-plus-outline" size={32} color={theme.colors.textSecondary} />
              <Text style={[styles.imageLabel, { color: theme.colors.textSecondary }]}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <InputField
        label="Full Name"
        placeholder="John Doe"
        value={fullName}
        onChangeText={setFullName}
        error={errors.fullName}
      />
      <InputField
        label="Username"
        placeholder="johndoe_swaps"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        error={errors.username}
      />
      <InputField
        label="Email"
        placeholder="johndoe@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />
      <InputField
        label="Password"
        placeholder="••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={errors.password}
      />
      <InputField
        label="Confirm Password"
        placeholder="••••••"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        error={errors.confirmPassword}
      />

      <CustomButton
        title="Register"
        onPress={handleRegister}
        loading={registering}
        containerStyle={styles.registerBtn}
      />

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.footerLink}>
        <Text style={{ color: theme.colors.textSecondary, fontWeight: '500' }}>
          Already have an account? <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageFrame: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  placeholderFrame: {
    alignItems: 'center',
  },
  imageLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  registerBtn: {
    marginTop: 20,
    marginBottom: 16,
  },
  footerLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
});
