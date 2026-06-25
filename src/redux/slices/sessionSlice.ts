import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SwapSession {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerImage?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // HH:MM
  notes: string;
  reminders: boolean;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

interface SessionState {
  sessions: SwapSession[];
  isLoading: boolean;
}

const MOCK_SESSIONS: SwapSession[] = [
  {
    id: 'sess1',
    partnerId: 'amit456',
    partnerName: 'Amit Patel',
    partnerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    date: '2026-06-28',
    time: '14:30',
    notes: 'React Native navigation principles and routing transitions.',
    reminders: true,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  }
];

const initialState: SessionState = {
  sessions: MOCK_SESSIONS,
  isLoading: false,
};

const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    setSessions(state, action: PayloadAction<SwapSession[]>) {
      state.sessions = action.payload;
    },
    scheduleSession(state, action: PayloadAction<SwapSession>) {
      state.sessions.unshift(action.payload);
    },
    cancelSession(state, action: PayloadAction<string>) {
      const session = state.sessions.find(s => s.id === action.payload);
      if (session) {
        session.status = 'cancelled';
      }
    },
    completeSession(state, action: PayloadAction<string>) {
      const session = state.sessions.find(s => s.id === action.payload);
      if (session) {
        session.status = 'completed';
      }
    },
  },
});

export const {
  setSessions,
  scheduleSession,
  cancelSession,
  completeSession,
} = sessionSlice.actions;

export default sessionSlice.reducer;
