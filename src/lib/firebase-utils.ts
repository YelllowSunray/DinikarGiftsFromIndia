import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  doc, 
  deleteDoc,
  serverTimestamp,
  connectFirestoreEmulator,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export interface RequestItem {
  id?: string;
  itemName: string;
  description: string;
  budget: number;
  urgency: 'low' | 'normal' | 'high' | 'urgent';
  quantity: number;
  preferredBrand?: string;
  specialInstructions?: string;
  requesterId: string;
  requesterName: string;
  requesterLocation: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed';
  travelerId?: string;
  travelerName?: string;
  travelDate?: string;
  serviceFee?: number;
  totalCost?: number;
  createdAt: any;
  updatedAt: any;
}

export interface Traveler {
  id?: string;
  name: string;
  email: string;
  phone: string;
  travelDate: string;
  departureCity: string;
  arrivalAirport: string;
  passportNumber: string;
  maxItems: number;
  serviceFee: number;
  userId: string;
  status: 'active' | 'inactive';
  createdAt: any;
  updatedAt: any;
}

// Return type for Firebase operations
export type FirebaseResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Helper function to handle Firestore connection issues
const handleFirestoreError = (error: any, operation: string): FirebaseResult<any> => {
  console.error(`Error in ${operation}:`, error);
  
  // Check for specific error types
  if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
    return { 
      success: false, 
      error: 'Database temporarily unavailable. Please try again in a few moments.' 
    };
  }
  
  if (error.code === 'permission-denied') {
    return { 
      success: false, 
      error: 'Access denied. Please check your authentication.' 
    };
  }
  
  if (error.code === 'not-found') {
    return { 
      success: false, 
      error: 'Database not found. Please check your configuration.' 
    };
  }
  
  return { 
    success: false, 
    error: `Database error: ${error.message || 'Unknown error'}` 
  };
};

// Request Functions
export const addRequest = async (requestData: Omit<RequestItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirebaseResult<string>> => {
  try {
    const docRef = await addDoc(collection(db, 'requests'), {
      ...requestData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, data: docRef.id };
  } catch (error) {
    return handleFirestoreError(error, 'adding request');
  }
};

export const getRequests = async (userId?: string): Promise<FirebaseResult<RequestItem[]>> => {
  try {
    let q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
    
    if (userId) {
      q = query(collection(db, 'requests'), where('requesterId', '==', userId), orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    const requests: RequestItem[] = [];
    
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() } as RequestItem);
    });
    
    return { success: true, data: requests };
  } catch (error) {
    return handleFirestoreError(error, 'getting requests');
  }
};

export const getAvailableRequests = async (): Promise<FirebaseResult<RequestItem[]>> => {
  try {
    const q = query(
      collection(db, 'requests'), 
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const requests: RequestItem[] = [];
    
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() } as RequestItem);
    });
    
    return { success: true, data: requests };
  } catch (error) {
    return handleFirestoreError(error, 'getting available requests');
  }
};

export const updateRequestStatus = async (requestId: string, status: RequestItem['status'], travelerId?: string, travelerName?: string): Promise<FirebaseResult<void>> => {
  try {
    const requestRef = doc(db, 'requests', requestId);
    const updateData: any = { 
      status, 
      updatedAt: serverTimestamp() 
    };
    
    if (travelerId) {
      updateData.travelerId = travelerId;
    }
    if (travelerName) {
      updateData.travelerName = travelerName;
    }
    
    await updateDoc(requestRef, updateData);
    return { success: true, data: undefined };
  } catch (error) {
    return handleFirestoreError(error, 'updating request status');
  }
};

// Traveler Functions
export const addTraveler = async (travelerData: Omit<Traveler, 'id' | 'createdAt' | 'updatedAt'>): Promise<FirebaseResult<string>> => {
  try {
    const docRef = await addDoc(collection(db, 'travelers'), {
      ...travelerData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, data: docRef.id };
  } catch (error) {
    return handleFirestoreError(error, 'adding traveler');
  }
};

export const getTravelers = async (): Promise<FirebaseResult<Traveler[]>> => {
  try {
    const q = query(collection(db, 'travelers'), where('status', '==', 'active'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const travelers: Traveler[] = [];
    
    querySnapshot.forEach((doc) => {
      travelers.push({ id: doc.id, ...doc.data() } as Traveler);
    });
    
    return { success: true, data: travelers };
  } catch (error) {
    return handleFirestoreError(error, 'getting travelers');
  }
};

export const getTravelerByUserId = async (userId: string): Promise<FirebaseResult<Traveler | null>> => {
  try {
    const q = query(collection(db, 'travelers'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { success: true, data: { id: doc.id, ...doc.data() } as Traveler };
    }
    
    return { success: true, data: null };
  } catch (error) {
    return handleFirestoreError(error, 'getting traveler by user ID');
  }
};

export const updateTraveler = async (travelerId: string, updateData: Partial<Traveler>): Promise<FirebaseResult<void>> => {
  try {
    const travelerRef = doc(db, 'travelers', travelerId);
    await updateDoc(travelerRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
    return { success: true, data: undefined };
  } catch (error) {
    return handleFirestoreError(error, 'updating traveler');
  }
};

// User Functions
export const getUserRequests = async (userId: string): Promise<FirebaseResult<RequestItem[]>> => {
  try {
    const q = query(
      collection(db, 'requests'), 
      where('requesterId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const requests: RequestItem[] = [];
    
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() } as RequestItem);
    });
    
    return { success: true, data: requests };
  } catch (error) {
    return handleFirestoreError(error, 'getting user requests');
  }
};

export const getTravelerRequests = async (travelerId: string): Promise<FirebaseResult<RequestItem[]>> => {
  try {
    const q = query(
      collection(db, 'requests'), 
      where('travelerId', '==', travelerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const requests: RequestItem[] = [];
    
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() } as RequestItem);
    });
    
    return { success: true, data: requests };
  } catch (error) {
    return handleFirestoreError(error, 'getting traveler requests');
  }
}; 