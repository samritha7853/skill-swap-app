import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { LIGHT_THEME, DARK_THEME, INITIAL_SKILLS } from '../constants/theme';
import SkillCard from '../components/SkillCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function DiscoverScreen({ navigation }: any) {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  const allUsers = useSelector((state: RootState) => state.auth.allUsers);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterSkill, setSelectedFilterSkill] = useState<string | null>(null);

  // Filter out the current logged-in user and apply search query & skill filters
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      // Don't show current logged in user in discover
      if (currentUser && user.uid === currentUser.uid) return false;

      const matchesSearch = 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.skillsOffered.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        user.skillsWanted.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSkillFilter = selectedFilterSkill
        ? user.skillsOffered.includes(selectedFilterSkill)
        : true;

      return matchesSearch && matchesSkillFilter;
    });
  }, [allUsers, currentUser, searchQuery, selectedFilterSkill]);

  const handleConnect = (user: any) => {
    navigation.navigate('SessionScheduler', { partnerId: user.uid, partnerName: user.fullName, partnerImage: user.profileImage });
  };

  const handleViewProfile = (user: any) => {
    navigation.navigate('UserProfileDetail', { userId: user.uid });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Discover Skills</Text>
        <View style={[styles.searchBar, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' }]}>
          <Icon name="magnify" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search users or skills..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Horizontal Scroll */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: !selectedFilterSkill ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
            onPress={() => setSelectedFilterSkill(null)}
          >
            <Text style={[styles.filterChipText, { color: !selectedFilterSkill ? '#FFF' : theme.colors.text }]}>
              All Skills
            </Text>
          </TouchableOpacity>
          {INITIAL_SKILLS.map((skill) => {
            const isSelected = selectedFilterSkill === skill;
            return (
              <TouchableOpacity
                key={skill}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => setSelectedFilterSkill(isSelected ? null : skill)}
              >
                <Text style={[styles.filterChipText, { color: isSelected ? '#FFF' : theme.colors.text }]}>
                  {skill}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* User Profiles Feed */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.uid}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="account-search-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No users found swapping this skill.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <SkillCard
            name={item.fullName}
            teach={item.skillsOffered.join(', ')}
            want={item.skillsWanted.join(', ')}
            profileImage={item.profileImage}
            rating={item.rating}
            bio={item.bio}
            onConnect={() => handleConnect(item)}
            onViewProfile={() => handleViewProfile(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  filterContainer: {
    paddingVertical: 12,
  },
  filterScroll: {
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
});
