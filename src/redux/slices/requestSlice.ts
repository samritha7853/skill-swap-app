import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SwapRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  receiverId: string;
  receiverName: string;
  receiverImage?: string;
  skillOffered: string;
  skillWanted: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  notes?: string;
  createdAt: string;
}

interface RequestState {
  requests: SwapRequest[];
  isLoading: boolean;
  error: string | null;
}

const MOCK_REQUESTS: SwapRequest[] = [
  {
    id: 'req1',
    senderId: 'priya123',
    senderName: 'Priya Sharma',
    senderImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    receiverId: 'currentUser', // will map to actual current user
    receiverName: 'Sam',
    skillOffered: 'UI/UX Design',
    skillWanted: 'React Native',
    status: 'pending',
    notes: 'Hey Sam! I saw you are learning Figma and can teach React Native. Let\'s swap!',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
  },
  {
    id: 'req2',
    senderId: 'currentUser',
    senderName: 'Sam',
    receiverId: 'amit456',
    receiverName: 'Amit Patel',
    receiverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    skillOffered: 'Figma',
    skillWanted: 'TypeScript',
    status: 'accepted',
    notes: 'Interested in mastering TypeScript hooks.',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
  }
];

const initialState: RequestState = {
  requests: MOCK_REQUESTS,
  isLoading: false,
  error: null,
};

const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setRequests(state, action: PayloadAction<SwapRequest[]>) {
      state.requests = action.payload;
      state.isLoading = false;
    },
    addRequest(state, action: PayloadAction<SwapRequest>) {
      state.requests.unshift(action.payload);
    },
    updateRequestStatus(state, action: PayloadAction<{ id: string; status: 'accepted' | 'rejected' | 'cancelled' }>) {
      const { id, status } = action.payload;
      const request = state.requests.find(r => r.id === id);
      if (request) {
        request.status = status;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setRequests,
  addRequest,
  updateRequestStatus,
  setLoading,
  setError,
} = requestSlice.actions;

export default requestSlice.reducer;
