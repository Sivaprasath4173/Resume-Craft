import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ApplicationCard, KanbanColumn } from '@/types/tracker';
import { useAuth } from './useAuth';
import { db } from '@/lib/firebase';
import {
  collection, doc, onSnapshot, setDoc, deleteDoc, updateDoc, query
} from 'firebase/firestore';

interface TrackerContextType {
  cards: ApplicationCard[];
  loading: boolean;
  addCard: (card: Omit<ApplicationCard, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateCard: (id: string, updates: Partial<ApplicationCard>) => Promise<void>;
  removeCard: (id: string) => Promise<void>;
  moveCard: (id: string, column: KanbanColumn) => Promise<void>;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cards, setCards] = useState<ApplicationCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCards([]);
      setLoading(false);
      return;
    }

    const colRef = collection(db, 'trackers', user.uid, 'cards');
    const q = query(colRef);
    const unsub = onSnapshot(q, snap => {
      const loaded = snap.docs.map(d => d.data() as ApplicationCard);
      setCards(loaded);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const addCard = useCallback(async (card: Omit<ApplicationCard, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('Not authenticated');
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const full: ApplicationCard = { ...card, id, createdAt: now, updatedAt: now };
    const ref = doc(db, 'trackers', user.uid, 'cards', id);
    await setDoc(ref, full);
    return id;
  }, [user]);

  const updateCard = useCallback(async (id: string, updates: Partial<ApplicationCard>) => {
    if (!user) return;
    const ref = doc(db, 'trackers', user.uid, 'cards', id);
    await updateDoc(ref, { ...updates, updatedAt: new Date().toISOString() });
  }, [user]);

  const removeCard = useCallback(async (id: string) => {
    if (!user) return;
    const ref = doc(db, 'trackers', user.uid, 'cards', id);
    await deleteDoc(ref);
  }, [user]);

  const moveCard = useCallback(async (id: string, column: KanbanColumn) => {
    await updateCard(id, { column });
  }, [updateCard]);

  return (
    <TrackerContext.Provider value={{ cards, loading, addCard, updateCard, removeCard, moveCard }}>
      {children}
    </TrackerContext.Provider>
  );
};

export const useTracker = () => {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error('useTracker must be used inside TrackerProvider');
  return ctx;
};
