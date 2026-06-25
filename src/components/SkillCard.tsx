import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { LIGHT_THEME, DARK_THEME } from '../constants/theme';
import RatingStars from './RatingStars';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SkillCardProps {
  name: string;
  teach: string;
  want: string;
  onConnect: () => void;
  profileImage?: string;
  rating?: number;
  bio?: string;
  onViewProfile?: () => void;
}

export default function SkillCard({
  name,
  teach,
  want,
  onConnect,
  profileImage,
  rating = 5.0,
  bio,
  onViewProfile,
}: SkillCardProps) {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.headerRow}>
        <Image source={{ uri: profileImage || defaultAvatar }} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={[styles.name, { color: theme.colors.text }]}>{name}</Text>
          <RatingStars rating={rating} size={14} showText={true} />
        </View>
        {onViewProfile && (
          <TouchableOpacity style={[styles.infoButton, { borderColor: theme.colors.primary }]} onPress={onViewProfile}>
            <Icon name="eye-outline" size={18} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {bio && (
        <Text style={[styles.bio, { color: theme.colors.textSecondary }]} numberOfLines={2}>
          {bio}
        </Text>
      )}

      <View style={styles.skillsSection}>
        <View style={styles.skillRow}>
          <Icon name="school-outline" size={16} color={theme.colors.success} style={styles.skillIcon} />
          <Text style={[styles.skillLabel, { color: theme.colors.textSecondary }]}>
            Teaches: <Text style={[styles.skillValue, { color: theme.colors.text }]}>{teach}</Text>
          </Text>
        </View>
        <View style={styles.skillRow}>
          <Icon name="book-open-variant-outline" size={16} color={theme.colors.primary} style={styles.skillIcon} />
          <Text style={[styles.skillLabel, { color: theme.colors.textSecondary }]}>
            Wants: <Text style={[styles.skillValue, { color: theme.colors.text }]}>{want}</Text>
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={onConnect}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Connect & Swap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  infoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bio: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  skillsSection: {
    marginBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  skillIcon: {
    marginRight: 8,
  },
  skillLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  skillValue: {
    fontWeight: '600',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
