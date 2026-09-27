import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, auth } from './firebase';
import {
  UserProfile,
  ResumeAnalysisResult,
  JobOpportunity,
  ApplicationTrackerItem,
  SkillGapAnalysisResult,
  ChatMessage
} from '../types/index';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// User Profile Operations
export async function getFirestoreUserProfile(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function saveFirestoreUserProfile(profile: UserProfile): Promise<void> {
  const path = `users/${profile.userId}`;
  try {
    const docRef = doc(db, 'users', profile.userId);
    await setDoc(docRef, {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Resume Analysis Operations
export async function saveFirestoreResumeAnalysis(analysis: ResumeAnalysisResult): Promise<string> {
  const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `resumeAnalyses/${analysisId}`;
  try {
    const docRef = doc(db, 'resumeAnalyses', analysisId);
    await setDoc(docRef, {
      ...analysis,
      id: analysisId
    });
    return analysisId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return '';
  }
}

export async function getFirestoreResumeAnalyses(userId: string): Promise<ResumeAnalysisResult[]> {
  const path = 'resumeAnalyses';
  try {
    const q = query(
      collection(db, 'resumeAnalyses'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as ResumeAnalysisResult);
  } catch (error) {
    // If composite index is pending, fallback to simple where
    try {
      const q = query(
        collection(db, 'resumeAnalyses'),
        where('userId', '==', userId)
      );
      const snap = await getDocs(q);
      const items = snap.docs.map(d => d.data() as ResumeAnalysisResult);
      return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (e2) {
      handleFirestoreError(error, OperationType.LIST, path);
      return [];
    }
  }
}

// Saved Jobs Operations
export async function saveFirestoreJob(userId: string, job: JobOpportunity): Promise<void> {
  const savedId = `${userId}_${job.id}`;
  const path = `savedJobs/${savedId}`;
  try {
    await setDoc(doc(db, 'savedJobs', savedId), {
      userId,
      jobId: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      jobData: job,
      savedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeFirestoreSavedJob(userId: string, jobId: string): Promise<void> {
  const savedId = `${userId}_${jobId}`;
  const path = `savedJobs/${savedId}`;
  try {
    await deleteDoc(doc(db, 'savedJobs', savedId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function getFirestoreSavedJobs(userId: string): Promise<JobOpportunity[]> {
  const path = 'savedJobs';
  try {
    const q = query(
      collection(db, 'savedJobs'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data().jobData as JobOpportunity).filter(Boolean);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// Application Tracking Operations
export async function getFirestoreApplications(userId: string): Promise<ApplicationTrackerItem[]> {
  const path = 'applications';
  try {
    const q = query(
      collection(db, 'applications'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as ApplicationTrackerItem);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveFirestoreApplication(appItem: ApplicationTrackerItem): Promise<void> {
  const path = `applications/${appItem.id}`;
  try {
    await setDoc(doc(db, 'applications', appItem.id), appItem, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteFirestoreApplication(appId: string): Promise<void> {
  const path = `applications/${appId}`;
  try {
    await deleteDoc(doc(db, 'applications', appId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Skill Gap Operations
export async function saveFirestoreSkillAnalysis(analysis: SkillGapAnalysisResult): Promise<void> {
  const analysisId = `skill_${Date.now()}`;
  const path = `skillAnalyses/${analysisId}`;
  try {
    await setDoc(doc(db, 'skillAnalyses', analysisId), {
      ...analysis,
      id: analysisId
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getLatestFirestoreSkillAnalysis(userId: string): Promise<SkillGapAnalysisResult | null> {
  const path = 'skillAnalyses';
  try {
    const q = query(
      collection(db, 'skillAnalyses'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const items = snap.docs.map(d => d.data() as SkillGapAnalysisResult);
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return null;
  }
}

// Chat Messages Operations
export async function saveFirestoreChatMessage(userId: string, role: 'user' | 'assistant', content: string): Promise<void> {
  const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const path = `chatMessages/${msgId}`;
  try {
    await setDoc(doc(db, 'chatMessages', msgId), {
      id: msgId,
      userId,
      role,
      content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getFirestoreChatHistory(userId: string): Promise<ChatMessage[]> {
  const path = 'chatMessages';
  try {
    const q = query(
      collection(db, 'chatMessages'),
      where('userId', '==', userId)
    );
    const snap = await getDocs(q);
    const items = snap.docs.map(d => d.data() as ChatMessage);
    return items.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}
