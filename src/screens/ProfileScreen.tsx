import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { LIGHT_THEME, DARK_THEME } from '../constants/theme';
import RatingStars from '../components/RatingStars';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ProfileScreen({ navigation }: any) {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const sessions = useSelector((state: RootState) => state.sessions.sessions);

  // Fallback default details if none saved yet
  const user = currentUser || {
    uid: 'currentUser',
    fullName: 'Sam',
    username: 'sam_swaps',
    email: 'sam@example.com',
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    bio: 'Self-taught mobile explorer ready to swap skills. Passionate about beautiful application UI.',
    skillsOffered: ['React Native', 'Figma'],
    skillsWanted: ['Python', 'Digital Marketing'],
    rating: 4.9,
    ratingsCount: 5,
    certificates: [],
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Profile</Text>
        <View style={styles.headerBtnRow}>
          <TouchableOpacity onPress={handleEditProfile} style={styles.iconBtn}>
            <Icon name="pencil-outline" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSettings} style={styles.iconBtn}>
            <Icon name="cog-outline" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
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
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About Me</Text>
          <Text style={[styles.bioText, { color: theme.colors.textSecondary }]}>
            {user.bio || 'Add a bio in your profile settings to let other swappers know you!'}
          </Text>
        </View>

        {/* Skills Offered */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Skills I Offer</Text>
          <View style={styles.chipRow}>
            {user.skillsOffered.length > 0 ? (
              user.skillsOffered.map((skill) => (
                <View key={`offered-${skill}`} style={[styles.chip, { backgroundColor: theme.colors.success + '15', borderColor: theme.colors.success }]}>
                  <Text style={[styles.chipText, { color: theme.colors.success }]}>{skill}</Text>
                </View>
              ))
            ) : (
              <Text style={{ color: theme.colors.textSecondary, fontStyle: 'italic', fontSize: 13 }}>No skills added yet.</Text>
            )}
          </View>
        </View>

        {/* Skills Wanted */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Skills I Want</Text>
          <View style={styles.chipRow}>
            {user.skillsWanted.length > 0 ? (
              user.skillsWanted.map((skill) => (
                <View key={`wanted-${skill}`} style={[styles.chip, { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary }]}>
                  <Text style={[styles.chipText, { color: theme.colors.primary }]}>{skill}</Text>
                </View>
              ))
            ) : (
              <Text style={{ color: theme.colors.textSecondary, fontStyle: 'italic', fontSize: 13 }}>No skills added yet.</Text>
            )}
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

        {/* Scheduled Sessions Calendar */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Scheduled Swap Sessions</Text>
          {sessions.length > 0 ? (
            sessions.map((sess) => (
              <View key={sess.id} style={[styles.sessionCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <View style={styles.sessionHeader}>
                  <Icon name="calendar-clock" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
                  <Text style={[styles.sessionDateTime, { color: theme.colors.text }]}>
                    {sess.date} @ {sess.time}
                  </Text>
                  <View style={[styles.sessionBadge, { backgroundColor: theme.colors.primary + '15' }]}>
                    <Text style={[styles.sessionBadgeText, { color: theme.colors.primary }]}>{sess.status}</Text>
                  </View>
                </View>
                <Text style={[styles.sessionPartner, { color: theme.colors.text }]}>
                  With <Text style={{ fontWeight: '700' }}>{sess.partnerName}</Text>
                </Text>
                {sess.notes ? <Text style={[styles.sessionNotes, { color: theme.colors.textSecondary }]}>{sess.notes}</Text> : null}
              </View>
            ))
          ) : (
            <View style={[styles.emptySession, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
              <Icon name="calendar-blank" size={28} color={theme.colors.textSecondary} style={{ marginBottom: 6 }} />
              <Text style={{ color: theme.colors.textSecondary, fontSize: 13, fontWeight: '500' }}>
                No upcoming sessions scheduled.
              </Text>
            </View>
          )}
        </View>

        <CustomButton
          title="Edit Skill Profile"
          onPress={handleEditProfile}
          containerStyle={{ marginTop: 10, marginBottom: 40 }}
        />
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
    paddingHorizontal: 20,
    height: 56,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  headerBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 16,
  },
  fullName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  username: {
    fontSize: 13,
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
  sessionCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionDateTime: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  sessionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  sessionBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  sessionPartner: {
    fontSize: 14,
    marginBottom: 6,
  },
  sessionNotes: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  emptySession: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
