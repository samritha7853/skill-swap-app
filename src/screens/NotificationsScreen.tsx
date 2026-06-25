import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { LIGHT_THEME, DARK_THEME } from '../constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'chat' | 'swap_request' | 'session';
  read: boolean;
  createdAt: string;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'New Swap Proposal',
    body: 'Priya Sharma wants to swap React Native for UI/UX Design.',
    type: 'swap_request',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: 'n2',
    title: 'Session Reminder',
    body: 'Your scheduled swap session with Amit Patel is coming up in 24 hours.',
    type: 'session',
    read: true,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
  },
  {
    id: 'n3',
    title: 'Chat Message',
    body: 'Amit Patel: "I sent you a swap session request. Please review it!"',
    type: 'chat',
    read: true,
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  }
];

export default function NotificationsScreen({ navigation }: any) {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    Alert.alert('Clear Notifications', 'Are you sure you want to dismiss all notifications?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: () => setNotifications([]) },
    ]);
  };

  const handleNotificationPress = (notif: AppNotification) => {
    handleMarkAsRead(notif.id);
    if (notif.type === 'swap_request') {
      navigation.navigate('Requests');
    } else if (notif.type === 'chat') {
      navigation.navigate('Messages');
    } else if (notif.type === 'session') {
      navigation.navigate('Profile'); // Tab Profile holds scheduled sessions in list
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'swap_request':
        return { name: 'swap-horizontal', color: theme.colors.primary };
      case 'session':
        return { name: 'calendar-clock', color: theme.colors.success };
      case 'chat':
      default:
        return { name: 'chat-outline', color: theme.colors.accent };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Notifications</Text>
        {notifications.length > 0 ? (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
            <Text style={[styles.clearBtnText, { color: theme.colors.primary }]}>Clear All</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 64 }} />
        )}
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="bell-off-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              All caught up! No notifications.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const iconConfig = getNotificationIcon(item.type);

          return (
            <TouchableOpacity
              style={[
                styles.notifCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
                !item.read && { borderLeftColor: theme.colors.primary, borderLeftWidth: 4 },
              ]}
              onPress={() => handleNotificationPress(item)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrapper, { backgroundColor: iconConfig.color + '15' }]}>
                <Icon name={iconConfig.name} size={22} color={iconConfig.color} />
              </View>

              <View style={styles.contentWrapper}>
                <View style={styles.titleRow}>
                  <Text style={[styles.title, { color: theme.colors.text }, !item.read && { fontWeight: '700' }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Icon name="close" size={16} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.body, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                  {item.body}
                </Text>
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
  clearBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  clearBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
    paddingBottom: 30,
  },
  notifCard: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contentWrapper: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
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
