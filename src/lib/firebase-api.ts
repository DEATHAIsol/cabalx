import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';
import { User, Cabal, Message, Conversation } from '@/types';

// Firebase API for CabalX
export const firebaseApi = {
  // =====================================================
  // USER MANAGEMENT
  // =====================================================

  // Get user by wallet address
  getUser: async (walletAddress: string): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', walletAddress));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          id: userDoc.id,
          walletAddress: data.walletAddress,
          username: data.username,
          displayName: data.displayName || data.username,
          bio: data.description || '',
          profileImageUrl: data.avatarUrl || '',
          cabalPoints: data.cabalPoints || 0,
          totalPnL: data.totalPnL || 0,
          winRate: data.winRate || 0,
          totalTrades: data.totalTrades || 0,
          winningTrades: data.winningTrades || 0,
          badges: data.badges || [],
          cabalId: data.cabalId || undefined,
          isCabalLeader: data.isCabalLeader || false,
          dmPrefs: data.dmPrefs || { allowFrom: 'everyone' },
          createdAt: data.createdAt?.toDate() || new Date(),
          lastActive: data.updatedAt?.toDate() || new Date()
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  // Create or update user
  upsertUser: async (user: Partial<User>): Promise<void> => {
    try {
      const userData = {
        walletAddress: user.walletAddress,
        username: user.username,
        displayName: user.displayName || user.username,
        description: user.bio || '',
        avatarUrl: user.profileImageUrl || '',
        cabalPoints: user.cabalPoints || 0,
        totalPnL: user.totalPnL || 0,
        winRate: user.winRate || 0,
        totalTrades: user.totalTrades || 0,
        winningTrades: user.winningTrades || 0,
        badges: user.badges || [],
        cabalId: user.cabalId || null, // Use null instead of undefined
        isCabalLeader: user.isCabalLeader || false,
        dmPrefs: user.dmPrefs || { allowFrom: 'everyone' },
        createdAt: user.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', user.walletAddress!), userData);
    } catch (error) {
      console.error('Error upserting user:', error);
      throw error;
    }
  },

  // Search users by username
  searchUsers: async (searchQuery: string): Promise<User[]> => {
    try {
      if (!searchQuery || searchQuery.length < 2) return [];

      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('username', '>=', searchQuery),
        where('username', '<=', searchQuery + '\uf8ff'),
        limit(10)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          walletAddress: data.walletAddress,
          username: data.username,
          displayName: data.displayName || data.username,
          bio: data.description || '',
          profileImageUrl: data.avatarUrl || '',
          cabalPoints: data.cabalPoints || 0,
          totalPnL: data.totalPnL || 0,
          winRate: data.winRate || 0,
          totalTrades: data.totalTrades || 0,
          winningTrades: data.winningTrades || 0,
          badges: data.badges || [],
          cabalId: data.cabalId || undefined,
          isCabalLeader: data.isCabalLeader || false,
          dmPrefs: data.dmPrefs || { allowFrom: 'everyone' },
          createdAt: data.createdAt?.toDate() || new Date(),
          lastActive: data.updatedAt?.toDate() || new Date()
        };
      });
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  },

  // Get all users for browsing
  getAllUsers: async (): Promise<User[]> => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('username', 'asc'), limit(50));
      
      const snapshot = await getDocs(q);
      console.log('getAllUsers: Found', snapshot.docs.length, 'users');
      
      return snapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          walletAddress: data.walletAddress,
          username: data.username,
          displayName: data.displayName || data.username,
          bio: data.description || '',
          profileImageUrl: data.avatarUrl || '',
          cabalPoints: data.cabalPoints || 0,
          totalPnL: data.totalPnL || 0,
          winRate: data.winRate || 0,
          totalTrades: data.totalTrades || 0,
          winningTrades: data.winningTrades || 0,
          badges: data.badges || [],
          cabalId: data.cabalId || undefined,
          isCabalLeader: data.isCabalLeader || false,
          dmPrefs: data.dmPrefs || { allowFrom: 'everyone' },
          createdAt: data.createdAt?.toDate() || new Date(),
          lastActive: data.updatedAt?.toDate() || new Date()
        };
      });
    } catch (error) {
      console.error('Error fetching all users:', error);
      // Return empty array if no users exist yet
      return [];
    }
  },

  // =====================================================
  // CABAL MANAGEMENT
  // =====================================================

  // Get all cabals
  getCabals: async (): Promise<Cabal[]> => {
    try {
      const cabalsRef = collection(db, 'cabals');
      const q = query(cabalsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data() as any;
        const members = data.members || [];
        return {
          id: doc.id,
          name: data.name,
          description: data.description || '',
          leaderWallet: data.leaderId,
          leaderUserId: data.leaderId,
          minCabalPoints: data.minCP || 0,
          totalCabalPoints: data.totalCP || 0,
          memberCount: members.length,
          icon: data.icon || '🏛️',
          isFull: members.length >= 50, // Assuming max 50 members
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
      });
    } catch (error) {
      console.error('Error fetching cabals:', error);
      return [];
    }
  },

  // Get cabal by ID
  getCabal: async (cabalId: string): Promise<Cabal | null> => {
    try {
      const cabalDoc = await getDoc(doc(db, 'cabals', cabalId));
      if (cabalDoc.exists()) {
        const data = cabalDoc.data() as any;
        const members = data.members || [];
        return {
          id: cabalDoc.id,
          name: data.name,
          description: data.description || '',
          leaderWallet: data.leaderId,
          leaderUserId: data.leaderId,
          minCabalPoints: data.minCP || 0,
          totalCabalPoints: data.totalCP || 0,
          memberCount: members.length,
          icon: data.icon || '🏛️',
          isFull: members.length >= 50, // Assuming max 50 members
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching cabal:', error);
      return null;
    }
  },

  // Get cabal members
  getCabalMembers: async (cabalId: string): Promise<User[]> => {
    try {
      const cabalDoc = await getDoc(doc(db, 'cabals', cabalId));
      if (!cabalDoc.exists()) return [];

      const data = cabalDoc.data() as any;
      const memberIds = data.members || [];

      if (memberIds.length === 0) return [];

      // Fetch user details for each member
      const memberUsers = await Promise.all(
        memberIds.map(async (userId: string) => {
          try {
            return await firebaseApi.getUser(userId);
          } catch (error) {
            console.error(`Error fetching member ${userId}:`, error);
            return null;
          }
        })
      );

      return memberUsers.filter((user): user is User => user !== null);
    } catch (error) {
      console.error('Error fetching cabal members:', error);
      return [];
    }
  },

  // Create cabal
  createCabal: async (cabal: Partial<Cabal>, leaderId: string): Promise<string> => {
    try {
      // Create cabal document
      const cabalData = {
        name: cabal.name,
        description: cabal.description || '',
        leaderId: leaderId,
        members: [leaderId],
        minCP: cabal.minCabalPoints || 0,
        totalCP: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const cabalRef = await addDoc(collection(db, 'cabals'), cabalData);
      const cabalId = cabalRef.id;

      // Create cabal chat room
      await addDoc(collection(db, 'rooms'), {
        type: 'cabal',
        cabalId: cabalId,
        participants: [leaderId],
        createdAt: serverTimestamp()
      });

      // Update user's cabal membership
      await updateDoc(doc(db, 'users', leaderId), {
        cabalId: cabalId,
        isCabalLeader: true,
        updatedAt: serverTimestamp()
      });

      return cabalId;
    } catch (error) {
      console.error('Error creating cabal:', error);
      throw error;
    }
  },

  // Join cabal
  joinCabal: async (cabalId: string, userId: string): Promise<void> => {
    try {
      // Add user to cabal members
      await updateDoc(doc(db, 'cabals', cabalId), {
        members: arrayUnion(userId),
        updatedAt: serverTimestamp()
      });

      // Add user to cabal chat room
      const roomsRef = collection(db, 'rooms');
      const q = query(roomsRef, where('cabalId', '==', cabalId));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const roomDoc = snapshot.docs[0];
        await updateDoc(roomDoc.ref, {
          participants: arrayUnion(userId)
        });
      }

      // Update user's cabal membership
      await updateDoc(doc(db, 'users', userId), {
        cabalId: cabalId,
        isCabalLeader: false,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error joining cabal:', error);
      throw error;
    }
  },

  // Leave cabal
  leaveCabal: async (cabalId: string, userId: string): Promise<void> => {
    try {
      // Remove user from cabal members
      await updateDoc(doc(db, 'cabals', cabalId), {
        members: arrayRemove(userId),
        updatedAt: serverTimestamp()
      });

      // Remove user from cabal chat room
      const roomsRef = collection(db, 'rooms');
      const q = query(roomsRef, where('cabalId', '==', cabalId));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const roomDoc = snapshot.docs[0];
        await updateDoc(roomDoc.ref, {
          participants: arrayRemove(userId)
        });
      }

      // Update user's cabal membership
      await updateDoc(doc(db, 'users', userId), {
        cabalId: null, // Use null instead of undefined
        isCabalLeader: false,
        updatedAt: serverTimestamp()
      });

      // Check if cabal is now empty and delete it
      const cabalDoc = await getDoc(doc(db, 'cabals', cabalId));
      if (cabalDoc.exists()) {
        const data = cabalDoc.data() as any;
        const members = data.members || [];
        
        if (members.length === 0) {
          // Delete empty cabal
          await deleteDoc(doc(db, 'cabals', cabalId));
          
          // Delete associated chat room
          if (!snapshot.empty) {
            await deleteDoc(snapshot.docs[0].ref);
          }
          
          console.log('Deleted empty cabal:', cabalId);
        }
      }
    } catch (error) {
      console.error('Error leaving cabal:', error);
      throw error;
    }
  },

  // =====================================================
  // CHAT ROOM MANAGEMENT
  // =====================================================

  // Get user's rooms (world, DMs, cabals)
  getUserRooms: async (userId: string): Promise<Conversation[]> => {
    try {
      const roomsRef = collection(db, 'rooms');
      const q = query(
        roomsRef,
        where('participants', 'array-contains', userId)
      );
      const snapshot = await getDocs(q);

      const conversations: Conversation[] = [];

      // Add world chat (always available)
      conversations.push({
        id: 'world',
        type: 'world',
        cabalId: undefined,
        createdAt: new Date()
      });

      // Add other rooms
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        conversations.push({
          id: doc.id,
          type: data.type,
          cabalId: data.cabalId,
          createdAt: data.createdAt?.toDate() || new Date()
        });
      });

      return conversations.sort((a, b) => {
        if (a.type === 'world') return -1;
        if (b.type === 'world') return 1;
        if (a.type === 'cabal') return -1;
        if (b.type === 'cabal') return 1;
        return 0;
      });
    } catch (error) {
      console.error('Error fetching user rooms:', error);
      return [{
        id: 'world',
        type: 'world',
        cabalId: undefined,
        createdAt: new Date()
      }];
    }
  },

  // Start DM conversation
  startDM: async (user1Id: string, user2Id: string): Promise<string> => {
    try {
      // Check if DM room already exists
      const roomsRef = collection(db, 'rooms');
      const q = query(
        roomsRef,
        where('type', '==', 'dm'),
        where('participants', 'array-contains', user1Id)
      );
      const snapshot = await getDocs(q);

      for (const doc of snapshot.docs) {
        const data = doc.data();
        if (data.participants.includes(user2Id)) {
          return doc.id; // Return existing DM room
        }
      }

      // Create new DM room
      const roomRef = await addDoc(collection(db, 'rooms'), {
        type: 'dm',
        participants: [user1Id, user2Id],
        createdAt: serverTimestamp()
      });

      return roomRef.id;
    } catch (error) {
      console.error('Error starting DM:', error);
      throw error;
    }
  },

  // =====================================================
  // MESSAGE MANAGEMENT
  // =====================================================

  // Get messages for a room
  getMessages: async (roomId: string, messageLimit: number = 50): Promise<Message[]> => {
    try {
      const messagesRef = collection(db, 'rooms', roomId, 'messages');
      const q = query(
        messagesRef,
        orderBy('createdAt', 'asc'),
        limit(messageLimit)
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          conversationId: roomId,
          cabalId: undefined, // Will be set by calling code if needed
          senderId: data.senderId,
          body: data.content,
          createdAt: data.createdAt?.toDate() || new Date(),
          softDeleted: false,
          sender: {
            id: data.senderId,
            username: data.senderUsername,
            displayName: data.senderDisplayName || data.senderUsername
          }
        };
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  // Send message
  sendMessage: async (roomId: string, message: Partial<Message>, sender: User): Promise<string> => {
    try {
      const messageData = {
        senderId: sender.id,
        senderUsername: sender.username,
        senderDisplayName: sender.displayName,
        senderAvatar: sender.profileImageUrl,
        content: message.body,
        createdAt: serverTimestamp()
      };

      const messageRef = await addDoc(
        collection(db, 'rooms', roomId, 'messages'),
        messageData
      );

      return messageRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Subscribe to messages (real-time)
  subscribeToMessages: (
    roomId: string,
    callback: (messages: Message[]) => void
  ) => {
    const messagesRef = collection(db, 'rooms', roomId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    return onSnapshot(q, (snapshot) => {
      const messages: Message[] = [];
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          conversationId: roomId,
          cabalId: undefined,
          senderId: data.senderId,
          body: data.content,
          createdAt: data.createdAt?.toDate() || new Date(),
          softDeleted: false,
          sender: {
            id: data.senderId,
            username: data.senderUsername,
            displayName: data.senderDisplayName || data.senderUsername
          }
        });
      });
      callback(messages);
    });
  },

  // =====================================================
  // STORAGE MANAGEMENT
  // =====================================================

  // Upload profile image
  uploadProfileImage: async (file: File, userId: string): Promise<string> => {
    try {
      const storageRef = ref(storage, `profile-images/${userId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  },

  // Delete profile image
  deleteProfileImage: async (imageUrl: string): Promise<void> => {
    try {
      const storageRef = ref(storage, imageUrl);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting profile image:', error);
      throw error;
    }
  },

  // Get room participants
  getRoomParticipants: async (roomId: string): Promise<User[]> => {
    try {
      const roomDoc = await getDoc(doc(db, 'rooms', roomId));
      if (!roomDoc.exists()) return [];

      const data = roomDoc.data() as any;
      const participantIds = data.participants || [];

      if (participantIds.length === 0) return [];

      // Fetch user details for each participant
      const participants = await Promise.all(
        participantIds.map(async (userId: string) => {
          try {
            return await firebaseApi.getUser(userId);
          } catch (error) {
            console.error(`Error fetching participant ${userId}:`, error);
            return null;
          }
        })
      );

      return participants.filter((user): user is User => user !== null);
    } catch (error) {
      console.error('Error fetching room participants:', error);
      return [];
    }
  },

  // Create test data for development
  createTestData: async (): Promise<void> => {
    try {
      console.log('Creating test data...');
      
      // Create test users
      const testUsers = [
        {
          walletAddress: 'test-user-1',
          username: 'Alice',
          displayName: 'Alice',
          description: 'Test user 1',
          cabalPoints: 1500,
          totalPnL: 100,
          winRate: 65,
          totalTrades: 50,
          winningTrades: 32,
          badges: [],
          cabalId: null,
          isCabalLeader: false,
          dmPrefs: { allowFrom: 'everyone' },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        },
        {
          walletAddress: 'test-user-2',
          username: 'Bob',
          displayName: 'Bob',
          description: 'Test user 2',
          cabalPoints: 2500,
          totalPnL: 200,
          winRate: 70,
          totalTrades: 80,
          winningTrades: 56,
          badges: [],
          cabalId: null,
          isCabalLeader: false,
          dmPrefs: { allowFrom: 'everyone' },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        },
        {
          walletAddress: 'test-user-3',
          username: 'Charlie',
          displayName: 'Charlie',
          description: 'Test user 3',
          cabalPoints: 3000,
          totalPnL: 300,
          winRate: 75,
          totalTrades: 100,
          winningTrades: 75,
          badges: [],
          cabalId: null,
          isCabalLeader: false,
          dmPrefs: { allowFrom: 'everyone' },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
      ];

      // Add test users
      for (const userData of testUsers) {
        await setDoc(doc(db, 'users', userData.walletAddress), userData);
      }

      console.log('Test users created successfully');
    } catch (error) {
      console.error('Error creating test data:', error);
    }
  }
}; 