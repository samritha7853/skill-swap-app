import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  uid: string;
  fullName: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  rating: number;
  ratingsCount: number;
  certificates: string[];
  createdAt?: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  allUsers: UserProfile[]; // directory of other users for search/recommendations
}

const DEFAULT_USERS: UserProfile[] = [
  {
    uid: 'priya123',
    fullName: 'Priya Sharma',
    username: 'priyadesigns',
    email: 'priya@example.com',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    bio: 'Senior UX Designer passionate about teaching Figma and interface design principles. Seeking to learn Python for automation.',
    skillsOffered: ['UI/UX Design', 'Figma', 'Prototyping'],
    skillsWanted: ['Python', 'Machine Learning'],
    rating: 4.8,
    ratingsCount: 12,
    certificates: ['Google UX Design Professional Certificate'],
  },
  {
    uid: 'amit456',
    fullName: 'Amit Patel',
    username: 'amit_codes',
    email: 'amit@example.com',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'React Native Developer with 3 years of experience. Wants to master creative illustration and vector assets.',
    skillsOffered: ['React Native', 'React', 'TypeScript'],
    skillsWanted: ['Figma', 'Digital Marketing'],
    rating: 4.9,
    ratingsCount: 8,
    certificates: ['Meta Front-End Developer Certificate'],
  },
  {
    uid: 'lucas789',
    fullName: 'Lucas Dupont',
    username: 'lucas_lang',
    email: 'lucas@example.com',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    bio: 'Native French speaker offering language classes. Eager to pick up fundamental coding skills for building personal projects.',
    skillsOffered: ['French', 'Spanish', 'Public Speaking'],
    skillsWanted: ['React Native', 'Python'],
    rating: 4.7,
    ratingsCount: 15,
    certificates: ['DELF French Examiner Certification'],
  },
  {
    uid: 'sara999',
    fullName: 'Sara Al-Mansoori',
    username: 'sara_growth',
    email: 'sara@example.com',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    bio: 'Digital marketing strategist. Helping creators grow their brand. I want to learn video editing tools.',
    skillsOffered: ['Digital Marketing', 'Content Writing'],
    skillsWanted: ['Video Editing', 'Piano'],
    rating: 4.6,
    ratingsCount: 9,
    certificates: ['Google Digital Garage Certified'],
  }
];

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  allUsers: DEFAULT_USERS,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    authSuccess(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    authFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateProfileSuccess(state, action: PayloadAction<Partial<UserProfile>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
      state.isLoading = false;
    },
    logoutSuccess(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    setAllUsers(state, action: PayloadAction<UserProfile[]>) {
      state.allUsers = action.payload;
    },
    addUserToDirectory(state, action: PayloadAction<UserProfile>) {
      if (!state.allUsers.find(u => u.uid === action.payload.uid)) {
        state.allUsers.push(action.payload);
      }
    },
  },
});

export const {
  authStart,
  authSuccess,
  authFailure,
  updateProfileSuccess,
  logoutSuccess,
  setAllUsers,
  addUserToDirectory,
} = authSlice.actions;

export default authSlice.reducer;
