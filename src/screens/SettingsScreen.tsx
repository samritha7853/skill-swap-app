import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { LIGHT_THEME, DARK_THEME } from '../constants/theme';
import { toggleTheme } from '../redux/slices/themeSlice';
import { authService } from '../services/authService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function SettingsScreen({ navigation }: any) {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;
  const dispatch = useDispatch();

  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Settings states
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out of SkillSwap?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await authService.signOut();
          // Reset navigation back to Login screen
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Account Info Profile Summary */}
        <View style={[styles.settingSection, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Account Details</Text>
          <View style={styles.profileSummary}>
            <Icon name="account-circle-outline" size={32} color={theme.colors.primary} style={{ marginRight: 16 }} />
            <View>
              <Text style={[styles.profileName, { color: theme.colors.text }]}>{currentUser?.fullName || 'Sam'}</Text>
              <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>{currentUser?.email || 'sam@example.com'}</Text>
            </View>
          </View>
        </View>

        {/* Display Settings */}
        <View style={[styles.settingSection, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Display & Theme</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Icon name="theme-light-dark" size={22} color={theme.colors.text} style={{ marginRight: 12 }} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleToggleTheme}
              trackColor={{ false: '#767577', true: theme.colors.primary + '80' }}
              thumbColor={isDarkMode ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={[styles.settingSection, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Notifications Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Icon name="bell-ring-outline" size={22} color={theme.colors.text} style={{ marginRight: 12 }} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Push Notifications</Text>
            </View>
            <Switch
              value={pushNotifs}
              onValueChange={setPushNotifs}
              trackColor={{ false: '#767577', true: theme.colors.primary + '80' }}
              thumbColor={pushNotifs ? theme.colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Icon name="email-outline" size={22} color={theme.colors.text} style={{ marginRight: 12 }} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Email Notifications</Text>
            </View>
            <Switch
              value={emailNotifs}
              onValueChange={setEmailNotifs}
              trackColor={{ false: '#767577', true: theme.colors.primary + '80' }}
              thumbColor={emailNotifs ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={[styles.settingSection, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Privacy & Safety</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Icon name="lock-outline" size={22} color={theme.colors.text} style={{ marginRight: 12 }} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Private Profile</Text>
            </View>
            <Switch
              value={isPrivateAccount}
              onValueChange={setIsPrivateAccount}
              trackColor={{ false: '#767577', true: theme.colors.primary + '80' }}
              thumbColor={isPrivateAccount ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
          <Text style={[styles.rowHelperText, { color: theme.colors.textSecondary }]}>
            Only approved swap matches will be able to see your certificates and rating breakdowns.
          </Text>
        </View>

        {/* Action Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: theme.colors.error }]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Icon name="logout" size={22} color={theme.colors.error} style={{ marginRight: 10 }} />
          <Text style={[styles.logoutBtnText, { color: theme.colors.error }]}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
  },
  settingSection: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 14,
  },
  profileSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  rowHelperText: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 8,
    paddingLeft: 34,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    height: 52,
    marginTop: 10,
    marginBottom: 40,
  },
  logoutBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
