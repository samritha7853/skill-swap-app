import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { LIGHT_THEME, DARK_THEME } from '../constants/theme';
import { dbService } from '../services/dbService';
import { storageService } from '../services/storageService';
import { markChatAsRead } from '../redux/slices/chatSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';

export default function ChatScreen({ route, navigation }: any) {
  const { chatId, partnerId, partnerName, partnerImage } = route.params;

  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;
  const dispatch = useDispatch();

  const messages = useSelector((state: RootState) => state.chats.messages[chatId] || []);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Mark all incoming messages in this chat as read on focus
  useEffect(() => {
    dispatch(markChatAsRead(chatId));
  }, [chatId, messages.length, dispatch]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const msgText = text.trim();
    setText('');
    try {
      await dbService.sendChatMessage(chatId, msgText);
    } catch (e: any) {
      Alert.alert('Send Error', 'Failed to send message.');
    }
  };

  const handleSendImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, async (response) => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        return;
      }
      
      const uri = response.assets?.[0]?.uri;
      if (uri) {
        try {
          setSending(true);
          const downloadUrl = await storageService.uploadCertificate(
            currentUser?.uid || 'currentUser',
            uri,
            `chat_image_${Date.now()}`
          );
          
          await dbService.sendChatMessage(chatId, '', downloadUrl);
        } catch (e: any) {
          Alert.alert('Upload Error', 'Failed to share image.');
        } finally {
          setSending(false);
        }
      }
    });
  };

  const handleScheduleSession = () => {
    navigation.navigate('SessionScheduler', {
      partnerId,
      partnerName,
      partnerImage,
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header bar */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-left" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Image
            source={{ uri: partnerImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' }}
            style={styles.avatar}
          />
          <View>
            <Text style={[styles.partnerName, { color: theme.colors.text }]}>{partnerName}</Text>
            <Text style={[styles.partnerStatus, { color: theme.colors.success }]}>Online</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleScheduleSession} style={[styles.scheduleBtn, { borderColor: theme.colors.primary }]}>
          <Icon name="calendar-clock" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Messages Scroll Area */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const isMe = item.senderId === 'currentUser' || item.senderId === currentUser?.uid;

          return (
            <View style={[styles.messageRow, isMe ? styles.myMessageRow : styles.otherMessageRow]}>
              <View
                style={[
                  styles.bubble,
                  {
                    backgroundColor: isMe
                      ? theme.colors.primary
                      : isDarkMode
                      ? '#1E293B'
                      : '#FFF',
                  },
                  isMe ? styles.myBubble : styles.otherBubble,
                  !isMe && { borderColor: theme.colors.border, borderWidth: 1 },
                ]}
              >
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.bubbleImage} resizeMode="cover" />
                ) : (
                  <Text style={[styles.bubbleText, { color: isMe ? '#FFF' : theme.colors.text }]}>
                    {item.text}
                  </Text>
                )}

                <View style={styles.bubbleFooter}>
                  <Text style={[styles.timeText, { color: isMe ? '#FFF' + 'B0' : theme.colors.textSecondary }]}>
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  {isMe && (
                    <Icon
                      name={item.read ? 'check-all' : 'check'}
                      size={14}
                      color={item.read ? '#34D399' : '#FFF' + '80'}
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Input box bottom bar */}
      <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.attachBtn} onPress={handleSendImage} disabled={sending}>
          <Icon name="image-outline" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        
        <TextInput
          style={[styles.input, { color: theme.colors.text, backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' }]}
          placeholder="Type message..."
          placeholderTextColor={theme.colors.textSecondary}
          value={text}
          onChangeText={setText}
          multiline
        />

        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: theme.colors.primary }]}
          onPress={handleSend}
          disabled={!text.trim()}
        >
          <Icon name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    height: 60,
    borderBottomWidth: 1,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  partnerName: {
    fontSize: 15,
    fontWeight: '700',
  },
  partnerStatus: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  scheduleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    width: '100%',
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  otherMessageRow: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
  },
  myBubble: {
    borderBottomRightRadius: 2,
  },
  otherBubble: {
    borderBottomLeftRadius: 2,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 20,
  },
  bubbleImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 4,
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
  },
  attachBtn: {
    padding: 8,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    maxHeight: 90,
    marginHorizontal: 8,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
