import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getFirestoreUserProfile, saveFirestoreUserProfile } from '../lib/firestoreService';
import { UserProfile } from '../types/index';
import { DEMO_PROFILE } from '../data/demoData';

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  college: string;
  currentYear: string;
  careerGoal: string;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isDemoUser: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (data: SignupData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsDemoUser: () => void;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  calculateProfileScore: (profile: UserProfile) => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function calculateProfileScore(p: UserProfile): number {
  let score = 20; // base for email & name

  if (p.college && p.currentYear) score += 15;
  if (p.degree && p.branch) score += 10;
  if (p.phone && p.location) score += 5;
  if (p.linkedin || p.github || p.portfolio) score += 10;

  const totalSkills = 
    (p.skills?.programmingLanguages?.length || 0) +
    (p.skills?.frameworks?.length || 0) +
    (p.skills?.databases?.length || 0);
  if (totalSkills >= 6) score += 15;
  else if (totalSkills >= 3) score += 10;

  if (p.projects && p.projects.length >= 2) score += 15;
  else if (p.projects && p.projects.length >= 1) score += 8;

  if (p.experience && p.experience.length >= 1) score += 5;
  if (p.certificates && p.certificates.length >= 1) score += 5;

  return Math.min(100, score);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  useEffect(() => {
    // Check if user was previously in demo mode
    const demoStored = localStorage.getItem('careerlens_demo_active');
    if (demoStored === 'true') {
      setIsDemoUser(true);
      const savedProfile = localStorage.getItem('careerlens_demo_profile');
      if (savedProfile) {
        try {
          setUserProfile(JSON.parse(savedProfile));
        } catch {
          setUserProfile(DEMO_PROFILE);
        }
      } else {
        setUserProfile(DEMO_PROFILE);
      }
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsDemoUser(false);
        localStorage.removeItem('careerlens_demo_active');
        try {
          const profile = await getFirestoreUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile);
          } else {
            // First time login via Google or uninitialized profile
            const newProfile: UserProfile = {
              userId: user.uid,
              fullName: user.displayName || 'Student',
              email: user.email || '',
              profilePhoto: user.photoURL || undefined,
              college: 'University Student',
              currentYear: '3rd Year',
              careerGoal: 'Software Engineer',
              skills: {
                programmingLanguages: ['Python', 'JavaScript'],
                frameworks: ['React'],
                databases: ['SQL'],
                dataScience: [],
                softSkills: ['Problem Solving', 'Teamwork'],
                other: ['Git']
              },
              projects: [],
              certificates: [],
              experience: [],
              preferences: {
                targetRole: 'Software Engineer',
                preferredLocation: 'Remote',
                workType: 'remote',
                jobType: 'internship'
              },
              profileScore: 45,
              createdAt: new Date().toISOString()
            };
            await saveFirestoreUserProfile(newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.error('Failed to load user profile from Firestore:', err);
        }
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    localStorage.removeItem('careerlens_demo_active');
    setIsDemoUser(false);
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signupWithEmail = async (data: SignupData) => {
    localStorage.removeItem('careerlens_demo_active');
    setIsDemoUser(false);
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    const newProfile: UserProfile = {
      userId: user.uid,
      fullName: data.fullName,
      email: data.email,
      college: data.college,
      currentYear: data.currentYear,
      careerGoal: data.careerGoal,
      skills: {
        programmingLanguages: ['Python', 'JavaScript'],
        frameworks: ['React'],
        databases: ['SQL'],
        dataScience: [],
        softSkills: ['Communication', 'Teamwork'],
        other: ['Git']
      },
      projects: [],
      certificates: [],
      experience: [],
      preferences: {
        targetRole: data.careerGoal,
        workType: 'remote',
        jobType: 'internship'
      },
      profileScore: 50,
      createdAt: new Date().toISOString()
    };

    await saveFirestoreUserProfile(newProfile);
    setUserProfile(newProfile);
  };

  const loginWithGoogle = async () => {
    localStorage.removeItem('careerlens_demo_active');
    setIsDemoUser(false);
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginAsDemoUser = () => {
    setIsDemoUser(true);
    setCurrentUser(null);
    setUserProfile(DEMO_PROFILE);
    localStorage.setItem('careerlens_demo_active', 'true');
    localStorage.setItem('careerlens_demo_profile', JSON.stringify(DEMO_PROFILE));
  };

  const logout = async () => {
    if (isDemoUser) {
      setIsDemoUser(false);
      setUserProfile(null);
      localStorage.removeItem('careerlens_demo_active');
      localStorage.removeItem('careerlens_demo_profile');
      return;
    }
    await firebaseSignOut(auth);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    if (!userProfile) return;

    const merged: UserProfile = {
      ...userProfile,
      ...updated,
      updatedAt: new Date().toISOString()
    };
    merged.profileScore = calculateProfileScore(merged);

    setUserProfile(merged);

    if (isDemoUser) {
      localStorage.setItem('careerlens_demo_profile', JSON.stringify(merged));
    } else {
      await saveFirestoreUserProfile(merged);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isLoading,
        isDemoUser,
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
        loginAsDemoUser,
        logout,
        resetPassword,
        updateProfile,
        calculateProfileScore
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
