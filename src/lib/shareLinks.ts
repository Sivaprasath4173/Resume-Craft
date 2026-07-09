import { db } from './firebase';
import {
  doc, setDoc, getDoc, collection, addDoc, onSnapshot,
  updateDoc, increment, Unsubscribe
} from 'firebase/firestore';
import { ShareLink, ReviewComment } from '@/types/review';
import { ResumeData } from '@/types/resume';

function generateToken(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function createShareLink(
  ownerUid: string,
  resumeData: ResumeData,
  mode: 'read-only' | 'comment' = 'comment'
): Promise<string> {
  const token = generateToken();
  const link: ShareLink = {
    token,
    ownerUid,
    createdAt: new Date().toISOString(),
    mode,
    resumeSnapshot: JSON.stringify(resumeData),
    unreadCount: 0,
  };
  await setDoc(doc(db, 'shareLinks', token), link);
  return token;
}

export async function getShareLink(token: string): Promise<ShareLink | null> {
  const snap = await getDoc(doc(db, 'shareLinks', token));
  if (!snap.exists()) return null;
  return snap.data() as ShareLink;
}

export async function addComment(
  token: string,
  section: string,
  text: string,
  authorName: string,
  itemId?: string
): Promise<string> {
  const commentsRef = collection(db, 'shareLinks', token, 'comments');
  const comment: Omit<ReviewComment, 'id'> = {
    token,
    section,
    itemId,
    text,
    authorName,
    authorAnon: true,
    createdAt: new Date().toISOString(),
    read: false,
  };
  const ref = await addDoc(commentsRef, comment);
  // Increment owner's unread count
  await updateDoc(doc(db, 'shareLinks', token), { unreadCount: increment(1) });
  return ref.id;
}

export function subscribeComments(
  token: string,
  callback: (comments: ReviewComment[]) => void
): Unsubscribe {
  const commentsRef = collection(db, 'shareLinks', token, 'comments');
  return onSnapshot(commentsRef, snap => {
    const comments = snap.docs.map(d => ({ id: d.id, ...d.data() } as ReviewComment));
    comments.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    callback(comments);
  });
}

export function subscribeUnreadCount(
  token: string,
  callback: (count: number) => void
): Unsubscribe {
  return onSnapshot(doc(db, 'shareLinks', token), snap => {
    if (snap.exists()) callback((snap.data() as ShareLink).unreadCount ?? 0);
  });
}

export async function markAllRead(token: string): Promise<void> {
  await updateDoc(doc(db, 'shareLinks', token), { unreadCount: 0 });
}
