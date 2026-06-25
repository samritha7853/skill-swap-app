import firestore from '@react-native-firebase/firestore';
import { store } from '../redux/store';
import { UserProfile, updateProfileSuccess } from '../redux/slices/authSlice';
import { SwapRequest, addRequest, updateRequestStatus } from '../redux/slices/requestSlice';
import { ChatMessage, addMessage } from '../redux/slices/chatSlice';
import { SwapSession, scheduleSession } from '../redux/slices/sessionSlice';

export const dbService = {
  // --- USER PROFILE OPERATIONS ---
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const doc = await firestore().collection('users').doc(uid).get();
      const exists = typeof doc.exists === 'function' ? (doc.exists as Function)() : doc.exists;
      if (exists) {
        return doc.data() as UserProfile;
      }
      return null;
    } catch (error: any) {
      console.warn('Firestore getUserProfile error:', error.message);
      // Fallback
      return store.getState().auth.allUsers.find(u => u.uid === uid) || null;
    }
  },

  async createUserProfile(uid: string, profile: UserProfile): Promise<void> {
    try {
      await firestore().collection('users').doc(uid).set(profile);
    } catch (error: any) {
      console.warn('Firestore createUserProfile error:', error.message);
    }
  },

  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      await firestore().collection('users').doc(uid).update(updates);
      store.dispatch(updateProfileSuccess(updates));
    } catch (error: any) {
      console.warn('Firestore updateUserProfile error, updating store offline:', error.message);
      store.dispatch(updateProfileSuccess(updates));
    }
  },

  // --- SWAP REQUEST OPERATIONS ---
  async sendSwapRequest(request: Omit<SwapRequest, 'id' | 'createdAt'>): Promise<SwapRequest> {
    const newRequest: SwapRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    try {
      await firestore().collection('swapRequests').doc(newRequest.id).set(newRequest);
      store.dispatch(addRequest(newRequest));
    } catch (error: any) {
      console.warn('Firestore sendSwapRequest error, updating store offline:', error.message);
      store.dispatch(addRequest(newRequest));
    }
    return newRequest;
  },

  async updateRequestStatus(requestId: string, status: 'accepted' | 'rejected' | 'cancelled'): Promise<void> {
    try {
      await firestore().collection('swapRequests').doc(requestId).update({ status });
      store.dispatch(updateRequestStatus({ id: requestId, status }));
    } catch (error: any) {
      console.warn('Firestore updateRequestStatus error, updating store offline:', error.message);
      store.dispatch(updateRequestStatus({ id: requestId, status }));
    }
  },

  // --- CHAT MESSAGE OPERATIONS ---
  async sendChatMessage(chatId: string, text: string, image?: string): Promise<ChatMessage> {
    const senderId = store.getState().auth.user?.uid || 'currentUser';
    const message: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      chatId,
      senderId,
      text,
      image,
      createdAt: new Date().toISOString(),
      read: false,
    };

    try {
      await firestore().collection('chats').doc(chatId).collection('messages').doc(message.id).set(message);
      await firestore().collection('chats').doc(chatId).update({
        lastMessage: text || 'Shared an image',
        lastMessageTime: message.createdAt,
      });
      store.dispatch(addMessage(message));
    } catch (error: any) {
      console.warn('Firestore sendChatMessage error, updating store offline:', error.message);
      store.dispatch(addMessage(message));
      
      // Simulate automatic response from Priya for standard demo flow!
      if (chatId === 'chat_priya') {
        setTimeout(() => {
          const autoReply: ChatMessage = {
            id: Math.random().toString(36).substr(2, 9),
            chatId,
            senderId: 'priya123',
            text: `Sure! That sounds perfect. Let's configure the session details using the Scheduler link!`,
            createdAt: new Date().toISOString(),
            read: false,
          };
          store.dispatch(addMessage(autoReply));
        }, 1500);
      }
    }
    return message;
  },

  // --- SESSION SCHEDULER OPERATIONS ---
  async scheduleSwapSession(session: Omit<SwapSession, 'id' | 'createdAt' | 'status'>): Promise<SwapSession> {
    const newSession: SwapSession = {
      ...session,
      id: Math.random().toString(36).substr(2, 9),
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    try {
      await firestore().collection('sessions').doc(newSession.id).set(newSession);
      store.dispatch(scheduleSession(newSession));
    } catch (error: any) {
      console.warn('Firestore scheduleSwapSession error, updating store offline:', error.message);
      store.dispatch(scheduleSession(newSession));
    }
    return newSession;
  },
};
