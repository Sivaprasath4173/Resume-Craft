export interface ShareLink {
  token: string;
  ownerUid: string;
  createdAt: string;
  expiresAt?: string;
  mode: 'read-only' | 'comment';
  /** Serialized resume snapshot at the time the link was created */
  resumeSnapshot: string;
  unreadCount: number;
}

export interface ReviewComment {
  id: string;
  token: string;
  section: string;
  itemId?: string;
  text: string;
  authorName: string;
  authorAnon: boolean;
  createdAt: string;
  read: boolean;
}
