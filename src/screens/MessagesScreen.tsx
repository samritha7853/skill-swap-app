import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { LIGHT_THEME, DARK_THEME } from '../constants/theme';
import { markChatAsRead } from '../redux/slices/chatSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function MessagesScreen({ navigation }: any) {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;
  const dispatch = useDispatch();

  const chats = useSelector((state: RootState) => state.chats.chats);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(chat => 
    chat.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (chat: any) => {
    dispatch(markChatAsRead(chat.id));
    navigation.navigate('Chat', {
      chatId: chat.id,
      partnerId: chat.participantId,
      partnerName: chat.participantName,
      partnerImage: chat.participantImage,
    });
  };

  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMins / 60);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHrs < 24) return `${diffHrs}h ago`;
      
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Messages</Text>
        
        {/* Search */}
        <View style={[styles.searchBar, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' }]}>
          <Icon name="magnify" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search conversations..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Conversations List */}
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="message-text-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No active conversations yet.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
          const hasUnread = item.unreadCount > 0;

          return (
            <TouchableOpacity
              style={[styles.chatRow, { borderBottomColor: theme.colors.border }]}
              onPress={() => handleChatPress(item)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: item.participantImage || defaultAvatar }} style={styles.avatar} />
              
              <View style={styles.chatDetails}>
                <View style={styles.chatHeaderRow}>
                  <Text style={[styles.name, { color: theme.colors.text }, hasUnread && styles.unreadText]}>
                    {item.participantName}
                  </Text>
                  <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
                    {formatTime(item.lastMessageTime)}
                  </Text>
                </View>
                
                <View style={styles.chatBodyRow}>
                  <Text
                    style={[styles.lastMessage, { color: theme.colors.textSecondary }, hasUnread && { color: theme.colors.text, fontWeight: '600' }]}
                    numberOfLines={1}
                  >
                    {item.lastMessage}
                  </Text>
                  {hasUnread && (
                    <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                      <Text style={styles.badgeText}>{item.unreadCount}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
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
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  chatRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 16,
  },
  chatDetails: {
    flex: 1,
  },
  chatHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  unreadText: {
    fontWeight: '700',
  },
  time: {
    fontSize: 12,
  },
  chatBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 120,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
});
