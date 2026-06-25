import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { LIGHT_THEME, DARK_THEME } from '../constants/theme';
import RatingStars from '../components/RatingStars';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function UserProfileDetailScreen({ route, navigation }: any) {
  const { userId } = route.params;
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  const allUsers = useSelector((state: RootState) => state.auth.allUsers);
  const user = allUsers.find((u) => u.uid === userId);

  if (!user) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>User profile not found.</Text>
      </View>
    );
  }

  const handleRequestSwap = () => {
    navigation.navigate('SessionScheduler', {
      partnerId: user.uid,
      partnerName: user.fullName,
      partnerImage: user.profileImage,
    });
  };

  const handleChat = () => {
    navigation.navigate('Chat', {
      chatId: `chat_${user.uid}`,
      partnerId: user.uid,
      partnerName: user.fullName,
      partnerImage: user.profileImage,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
        <TouchableOpacity onPress={handleChat} style={styles.chatBtn}>
          <Icon name="message-outline" size={22} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View style={[styles.profileCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Image
            source={{ uri: user.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' }}
            style={styles.avatar}
          />
          <Text style={[styles.fullName, { color: theme.colors.text }]}>{user.fullName}</Text>
          <Text style={[styles.username, { color: theme.colors.textSecondary }]}>@{user.username}</Text>
          
          <View style={styles.starsWrapper}>
            <RatingStars rating={user.rating} count={user.ratingsCount} size={20} />
          </View>
        </View>

        {/* Bio */}
        {user.bio && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About</Text>
            <Text style={[styles.bioText, { color: theme.colors.textSecondary }]}>{user.bio}</Text>
          </View>
        )}

        {/* Skills Offered */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Skills Offered</Text>
          <View style={styles.chipRow}>
            {user.skillsOffered.map((skill) => (
              <View key={`offered-${skill}`} style={[styles.chip, { backgroundColor: theme.colors.success + '15', borderColor: theme.colors.success }]}>
                <Text style={[styles.chipText, { color: theme.colors.success }]}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Skills Wanted */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Skills Wanted</Text>
          <View style={styles.chipRow}>
            {user.skillsWanted.map((skill) => (
              <View key={`wanted-${skill}`} style={[styles.chip, { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary }]}>
                <Text style={[styles.chipText, { color: theme.colors.primary }]}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Certificates */}
        {user.certificates && user.certificates.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Certifications</Text>
            {user.certificates.map((cert, index) => (
              <View key={`cert-${index}`} style={[styles.certRow, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
                <Icon name="certificate" size={20} color={theme.colors.warning} style={{ marginRight: 10 }} />
                <Text style={[styles.certText, { color: theme.colors.text }]}>{cert}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Button */}
        <CustomButton
          title="Request Skill Swap"
          onPress={handleRequestSwap}
          containerStyle={{ marginTop: 24, marginBottom: 40 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
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
  chatBtn: {
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
  profileCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 16,
  },
  fullName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    marginBottom: 12,
  },
  starsWrapper: {
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  certText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
});
