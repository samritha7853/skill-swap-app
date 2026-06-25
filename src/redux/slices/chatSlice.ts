import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Chat {
  id: string;
  participantId: string;
  participantName: string;
  participantImage?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  image?: string;
  createdAt: string;
  read: boolean;
}

interface ChatState {
  chats: Chat[];
  messages: { [chatId: string]: ChatMessage[] };
  isLoading: boolean;
  error: string | null;
}

const MOCK_CHATS: Chat[] = [
  {
    id: 'chat_priya',
    participantId: 'priya123',
    participantName: 'Priya Sharma',
    participantImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'Great! Can we schedule a session for this Saturday?',
    lastMessageTime: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    unreadCount: 1,
  },
  {
    id: 'chat_amit',
    participantId: 'amit456',
    participantName: 'Amit Patel',
    participantImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    lastMessage: 'I sent you a swap session request. Please review it!',
    lastMessageTime: new Date(Date.now() - 3600000 * 20).toISOString(), // 20 hours ago
    unreadCount: 0,
  }
];

const MOCK_MESSAGES: { [chatId: string]: ChatMessage[] } = {
  chat_priya: [
    {
      id: 'm1',
      chatId: 'chat_priya',
      senderId: 'priya123',
      text: 'Hi Sam! Thanks for connecting.',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      read: true,
    },
    {
      id: 'm2',
      chatId: 'chat_priya',
      senderId: 'currentUser',
      text: 'Hello Priya, absolute pleasure! I would love to learn UX principles and can help you build apps in React Native.',
      createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString(),
      read: true,
    },
    {
      id: 'm3',
      chatId: 'chat_priya',
      senderId: 'priya123',
      text: 'Great! Can we schedule a session for this Saturday?',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      read: false,
    }
  ],
  chat_amit: [
    {
      id: 'm4',
      chatId: 'chat_amit',
      senderId: 'currentUser',
      text: 'Hey Amit, are you free to discuss React hooks today?',
      createdAt: new Date(Date.now() - 3600000 * 21).toISOString(),
      read: true,
    },
    {
      id: 'm5',
      chatId: 'chat_amit',
      senderId: 'amit456',
      text: 'I sent you a swap session request. Please review it!',
      createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      read: true,
    }
  ]
};

const initialState: ChatState = {
  chats: MOCK_CHATS,
  messages: MOCK_MESSAGES,
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<Chat[]>) {
      state.chats = action.payload;
    },
    setMessages(state, action: PayloadAction<{ chatId: string; messages: ChatMessage[] }>) {
      state.messages[action.payload.chatId] = action.payload.messages;
    },
    addMessage(state, action: PayloadAction<ChatMessage>) {
      const { chatId } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(action.payload);
      
      // Update last message in the chat thread list
      const chat = state.chats.find(c => c.id === chatId);
      if (chat) {
        chat.lastMessage = action.payload.text || 'Shared an image';
        chat.lastMessageTime = action.payload.createdAt;
        if (action.payload.senderId !== 'currentUser') {
          chat.unreadCount += 1;
        }
      }
    },
    markChatAsRead(state, action: PayloadAction<string>) {
      const chatId = action.payload;
      const chat = state.chats.find(c => c.id === chatId);
      if (chat) {
        chat.unreadCount = 0;
      }
      if (state.messages[chatId]) {
        state.messages[chatId] = state.messages[chatId].map(m => 
          m.senderId !== 'currentUser' ? { ...m, read: true } : m
        );
      }
    },
    createChatThread(state, action: PayloadAction<Chat>) {
      if (!state.chats.find(c => c.id === action.payload.id)) {
        state.chats.unshift(action.payload);
        state.messages[action.payload.id] = [];
      }
    },
  },
});

export const {
  setChats,
  setMessages,
  addMessage,
  markChatAsRead,
  createChatThread,
} = chatSlice.actions;

export default chatSlice.reducer;
