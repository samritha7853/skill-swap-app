import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { LIGHT_THEME, DARK_THEME } from '../constants/theme';
import { dbService } from '../services/dbService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createChatThread } from '../redux/slices/chatSlice';

export default function RequestsScreen({ navigation }: any) {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;
  const dispatch = useDispatch();

  const requests = useSelector((state: RootState) => state.requests.requests);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  // Filter requests based on role
  const displayedRequests = requests.filter((req) => {
    const currentUid = currentUser?.uid || 'currentUser';
    if (activeTab === 'received') {
      return req.receiverId === currentUid;
    } else {
      return req.senderId === currentUid;
    }
  });

  const handleAccept = async (requestId: string, request: any) => {
    try {
      await dbService.updateRequestStatus(requestId, 'accepted');
      Alert.alert('Request Accepted', 'You can now start chatting to schedule a swap!');
      
      // Auto-create a chat thread in Redux to chat with the sender
      const chatThreadId = `chat_${request.senderId}`;
      dispatch(createChatThread({
        id: chatThreadId,
        participantId: request.senderId,
        participantName: request.senderName,
        participantImage: request.senderImage,
        lastMessage: 'Swap request accepted! Let\'s coordinate our swap session.',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
      }));
    } catch (e: any) {
      Alert.alert('Error', 'Could not accept swap request.');
    }
  };

  const handleReject = async (requestId: string) => {
    Alert.alert(
      'Reject Request',
      'Are you sure you want to reject this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reject', style: 'destructive', onPress: () => dbService.updateRequestStatus(requestId, 'rejected') },
      ]
    );
  };

  const handleCancel = async (requestId: string) => {
    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel this request?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Cancel Request', style: 'destructive', onPress: () => dbService.updateRequestStatus(requestId, 'cancelled') },
      ]
    );
  };

  const handleStartChat = (request: any) => {
    const isReceived = activeTab === 'received';
    const partnerId = isReceived ? request.senderId : request.receiverId;
    const partnerName = isReceived ? request.senderName : request.receiverName;
    const partnerImage = isReceived ? request.senderImage : request.receiverImage;
    const chatId = `chat_${partnerId}`;

    navigation.navigate('Chat', { chatId, partnerId, partnerName, partnerImage });
  };

  const getStatusBadge = (status: string) => {
    let color = theme.colors.warning;
    let label = 'Pending';
    let icon = 'clock-outline';

    if (status === 'accepted') {
      color = theme.colors.success;
      label = 'Accepted';
      icon = 'check-circle-outline';
    } else if (status === 'rejected') {
      color = theme.colors.error;
      label = 'Rejected';
      icon = 'close-circle-outline';
    } else if (status === 'cancelled') {
      color = theme.colors.textSecondary;
      label = 'Cancelled';
      icon = 'cancel';
    }

    return (
      <View style={[styles.badge, { backgroundColor: color + '15' }]}>
        <Icon name={icon} size={14} color={color} style={styles.badgeIcon} />
        <Text style={[styles.badgeText, { color }]}>{label}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Swap Requests</Text>
      </View>

      {/* Segmented Tab Control */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'received' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 3 },
          ]}
          onPress={() => setActiveTab('received')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'received' ? theme.colors.primary : theme.colors.textSecondary },
              activeTab === 'received' && { fontWeight: '700' },
            ]}
          >
            Received
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'sent' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 3 },
          ]}
          onPress={() => setActiveTab('sent')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'sent' ? theme.colors.primary : theme.colors.textSecondary },
              activeTab === 'sent' && { fontWeight: '700' },
            ]}
          >
            Sent
          </Text>
        </TouchableOpacity>
      </View>

      {/* Requests List */}
      <FlatList
        data={displayedRequests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="swap-horizontal" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No swap requests in this category.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
          const isReceived = activeTab === 'received';
          const displayName = isReceived ? item.senderName : item.receiverName;
          const displayImage = isReceived ? item.senderImage : item.receiverImage;

          return (
            <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
              <View style={styles.cardHeader}>
                <Image source={{ uri: displayImage || defaultAvatar }} style={styles.avatar} />
                <View style={styles.cardTitleSection}>
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{displayName}</Text>
                  <Text style={[styles.cardSub, { color: theme.colors.textSecondary }]}>
                    Offered: <Text style={{ color: theme.colors.text, fontWeight: '600' }}>{item.skillOffered}</Text>
                  </Text>
                  <Text style={[styles.cardSub, { color: theme.colors.textSecondary }]}>
                    Wanted: <Text style={{ color: theme.colors.text, fontWeight: '600' }}>{item.skillWanted}</Text>
                  </Text>
                </View>
                {getStatusBadge(item.status)}
              </View>

              {item.notes && (
                <View style={[styles.notesContainer, { backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC' }]}>
                  <Text style={[styles.notesText, { color: theme.colors.text }]}>{item.notes}</Text>
                </View>
              )}

              {/* Action Buttons based on status */}
              {item.status === 'pending' && isReceived && (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.rejectBtn, { borderColor: theme.colors.error }]}
                    onPress={() => handleReject(item.id)}
                  >
                    <Text style={[styles.actionBtnText, { color: theme.colors.error }]}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.acceptBtn, { backgroundColor: theme.colors.success }]}
                    onPress={() => handleAccept(item.id, item)}
                  >
                    <Text style={[styles.actionBtnText, { color: '#FFF' }]}>Accept</Text>
                  </TouchableOpacity>
                </View>
              )}

              {item.status === 'pending' && !isReceived && (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.rejectBtn, { borderColor: theme.colors.error, flex: 1 }]}
                    onPress={() => handleCancel(item.id)}
                  >
                    <Text style={[styles.actionBtnText, { color: theme.colors.error }]}>Cancel Request</Text>
                  </TouchableOpacity>
                </View>
              )}

              {item.status === 'accepted' && (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.acceptBtn, { backgroundColor: theme.colors.primary, flex: 1 }]}
                    onPress={() => handleStartChat(item)}
                  >
                    <Icon name="message-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={[styles.actionBtnText, { color: '#FFF' }]}>Message</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
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
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  tabContainer: {
    flexDirection: 'row',
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
    paddingBottom: 30,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  cardTitleSection: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    marginBottom: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  notesContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  notesText: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  rejectBtn: {
    borderWidth: 1.5,
  },
  acceptBtn: {},
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
