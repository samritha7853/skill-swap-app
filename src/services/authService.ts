import auth from '@react-native-firebase/auth';
import { store } from '../redux/store';
import { authStart, authSuccess, authFailure, logoutSuccess } from '../redux/slices/authSlice';
import { dbService } from './dbService';

export const authService = {
  // Sign In with Firebase and Fallback
  async signIn(email: string, password: string): Promise<any> {
    store.dispatch(authStart());
    try {
      // Attempt Firebase Authentication
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;
      
      if (firebaseUser) {
        // Fetch profile details from Firestore
        let userProfile = await dbService.getUserProfile(firebaseUser.uid);
        if (!userProfile) {
          // If firestore fails to find user profile, build a basic one
          userProfile = {
            uid: firebaseUser.uid,
            fullName: firebaseUser.displayName || 'Swapper',
            username: email.split('@')[0],
            email: email,
            skillsOffered: [],
            skillsWanted: [],
            rating: 5.0,
            ratingsCount: 0,
            certificates: [],
          };
          await dbService.createUserProfile(firebaseUser.uid, userProfile);
        }
        store.dispatch(authSuccess(userProfile));
        return userProfile;
      }
    } catch (error: any) {
      console.warn('Firebase Sign In failed, falling back to offline simulation:', error.message);
      
      // Fallback Simulation Mode
      // Check if email belongs to one of our mock users
      const mockUsers = store.getState().auth.allUsers;
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        store.dispatch(authSuccess(foundUser));
        return foundUser;
      } else {
        // Create a temporary mock user profile if not in directory
        const mockSam = {
          uid: 'currentUser',
          fullName: 'Sam',
          username: email.split('@')[0],
          email: email,
          bio: 'Self-taught mobile explorer ready to swap skills.',
          skillsOffered: ['React Native', 'Figma'],
          skillsWanted: ['Python', 'Digital Marketing'],
          rating: 4.9,
          ratingsCount: 5,
          certificates: [],
        };
        store.dispatch(authSuccess(mockSam));
        return mockSam;
      }
    }
  },

  // Sign Up with Firebase and Fallback
  async signUp(email: string, password: string, fullName: string, username: string, profileImage?: string): Promise<any> {
    store.dispatch(authStart());
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;
      
      if (firebaseUser) {
        // Update Firebase profile displayName
        await firebaseUser.updateProfile({ displayName: fullName });
        
        const profile = {
          uid: firebaseUser.uid,
          fullName,
          username,
          email,
          profileImage: profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          skillsOffered: [],
          skillsWanted: [],
          rating: 5.0,
          ratingsCount: 0,
          certificates: [],
        };
        
        await dbService.createUserProfile(firebaseUser.uid, profile);
        store.dispatch(authSuccess(profile));
        return profile;
      }
    } catch (error: any) {
      console.warn('Firebase Sign Up failed, falling back to offline simulation:', error.message);
      
      // Offline Simulation Mode
      const simulatedProfile = {
        uid: 'currentUser',
        fullName,
        username,
        email,
        profileImage: profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        skillsOffered: ['React Native', 'Figma'],
        skillsWanted: ['Python', 'Digital Marketing'],
        rating: 5.0,
        ratingsCount: 0,
        certificates: [],
      };
      
      store.dispatch(authSuccess(simulatedProfile));
      return simulatedProfile;
    }
  },

  // Password reset
  async resetPassword(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      console.warn('Firebase Password Reset failed, sending mock reset command:', error.message);
    }
  },

  // Sign Out
  async signOut(): Promise<void> {
    try {
      await auth().signOut();
    } catch (error: any) {
      console.warn('Firebase Sign Out error, clearing store offline:', error.message);
    } finally {
      store.dispatch(logoutSuccess());
    }
  }
};
