import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { LIGHT_THEME, DARK_THEME, SKILL_CATEGORIES } from '../constants/theme';
import RatingStars from '../components/RatingStars';
import SkillCard from '../components/SkillCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeScreen({ navigation }: any) {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const allUsers = useSelector((state: RootState) => state.auth.allUsers);

  // Compute recommended users:
  // Show users whose offered skills match current user's wanted skills, or generally high-rated matches
  const recommendedMatches = useMemo(() => {
    return allUsers
      .filter((user) => {
        if (currentUser && user.uid === currentUser.uid) return false;
        
        // Match if they teach what we want
        const matchesWanted = currentUser?.skillsWanted.some((skill) =>
          user.skillsOffered.includes(skill)
        );
        return matchesWanted || user.rating >= 4.7;
      })
      .slice(0, 3);
  }, [allUsers, currentUser]);

  // Featured users: High rated profiles
  const featuredUsers = useMemo(() => {
    return allUsers
      .filter((user) => currentUser ? user.uid !== currentUser.uid : true)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);
  }, [allUsers, currentUser]);

  const handleCategoryPress = (categoryName: string) => {
    navigation.navigate('Discover', { filterSkill: categoryName });
  };

  const handleViewProfile = (userId: string) => {
    navigation.navigate('UserProfileDetail', { userId });
  };

  const handleConnect = (user: any) => {
    navigation.navigate('SessionScheduler', { partnerId: user.uid, partnerName: user.fullName, partnerImage: user.profileImage });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>
      {/* App bar with Greetings and Settings */}
      <View style={styles.topHeader}>
        <View style={styles.greetingRow}>
          <Image
            source={{ uri: currentUser?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' }}
            style={styles.avatar}
          />
          <View>
            <Text style={[styles.subGreeting, { color: theme.colors.textSecondary }]}>Hello,</Text>
            <Text style={[styles.mainGreeting, { color: theme.colors.text }]}>
              {currentUser?.fullName ? currentUser.fullName.split(' ')[0] : 'Sam'} 👋
            </Text>
          </View>
        </View>
        <View style={styles.headerActionRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={[styles.iconBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Icon name="bell-outline" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={[styles.iconBtn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Icon name="cog-outline" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Style Search Bar */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Discover')}
        style={[styles.searchSection, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      >
        <Icon name="magnify" size={22} color={theme.colors.textSecondary} style={{ marginRight: 10 }} />
        <Text style={[styles.searchPlaceholder, { color: theme.colors.textSecondary }]}>
          Search skills to learn today...
        </Text>
      </TouchableOpacity>

      {/* Categories chips section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {SKILL_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={() => handleCategoryPress(cat.name)}
            >
              <Icon name={cat.icon} size={24} color={theme.colors.primary} style={{ marginBottom: 6 }} />
              <Text style={[styles.categoryLabel, { color: theme.colors.text }]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Swappers Section (Horizontal list) */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Featured Swappers</Text>
        <FlatList
          horizontal
          data={featuredUsers}
          keyExtractor={(item) => `feat-${item.uid}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredScroll}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.featCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={() => handleViewProfile(item.uid)}
              activeOpacity={0.9}
            >
              <Image source={{ uri: item.profileImage }} style={styles.featAvatar} />
              <Text style={[styles.featName, { color: theme.colors.text }]} numberOfLines={1}>{item.fullName}</Text>
              <RatingStars rating={item.rating} size={12} showText={false} />
              <View style={[styles.featBadge, { backgroundColor: theme.colors.primary + '15' }]}>
                <Text style={[styles.featBadgeText, { color: theme.colors.primary }]} numberOfLines={1}>
                  {item.skillsOffered[0]}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Trending skills list */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Trending Skills</Text>
        <View style={styles.trendingRow}>
          {['React Native', 'Figma Design', 'Python AI', 'Data Science', 'Content Strategy', 'Video Editing'].map((skill) => (
            <TouchableOpacity
              key={skill}
              style={[styles.trendingChip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={() => navigation.navigate('Discover')}
            >
              <Icon name="trending-up" size={14} color={theme.colors.primary} style={{ marginRight: 6 }} />
              <Text style={[styles.trendingText, { color: theme.colors.text }]}>{skill}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recommended Matches List */}
      <View style={[styles.section, { marginBottom: 30 }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recommended Matches</Text>
        {recommendedMatches.map((item) => (
          <SkillCard
            key={`match-${item.uid}`}
            name={item.fullName}
            teach={item.skillsOffered.join(', ')}
            want={item.skillsWanted.join(', ')}
            profileImage={item.profileImage}
            rating={item.rating}
            bio={item.bio}
            onConnect={() => handleConnect(item)}
            onViewProfile={() => handleViewProfile(item.uid)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  subGreeting: {
    fontSize: 13,
    fontWeight: '500',
  },
  mainGreeting: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  searchPlaceholder: {
    fontSize: 15,
    fontWeight: '500',
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    paddingBottom: 6,
    gap: 10,
  },
  categoryCard: {
    width: 100,
    height: 80,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  featuredScroll: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 12,
  },
  featCard: {
    width: 110,
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  featAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginBottom: 8,
  },
  featName: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  featBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  featBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  trendingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
  },
  trendingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  trendingText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
