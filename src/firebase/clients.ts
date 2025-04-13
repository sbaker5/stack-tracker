import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  DocumentReference,
  DocumentData
} from 'firebase/firestore';
import { db, auth } from './config';
import { Technology, Client } from '../types/models';

// Get the user's collection reference
const getUserCollection = (collectionName: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('User not authenticated');
  return collection(db, 'users', userId, collectionName);
};

// Add a new client
export const addClient = async (client: Omit<Client, 'id'>) => {
  try {
    const clientsRef = getUserCollection('clients');
    const newClientRef = doc(clientsRef);
    
    await setDoc(newClientRef, {
      ...client,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { 
      id: newClientRef.id, 
      error: null 
    };
  } catch (error) {
    return { id: null, error };
  }
};

// Update an existing client
export const updateClient = async (id: string, clientData: Partial<Client>) => {
  try {
    const clientRef = doc(getUserCollection('clients'), id);
    
    await updateDoc(clientRef, {
      ...clientData,
      updatedAt: serverTimestamp()
    });
    
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error };
  }
};

// Delete a client
export const deleteClient = async (id: string) => {
  try {
    const clientRef = doc(getUserCollection('clients'), id);
    await deleteDoc(clientRef);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error };
  }
};

// Get a single client by ID
export const getClient = async (id: string) => {
  try {
    const clientRef = doc(getUserCollection('clients'), id);
    const clientSnap = await getDoc(clientRef);
    
    if (clientSnap.exists()) {
      return { 
        client: { id: clientSnap.id, ...clientSnap.data() } as Client, 
        error: null 
      };
    } else {
      return { client: null, error: 'Client not found' };
    }
  } catch (error) {
    return { client: null, error };
  }
};

// Get all clients
export const getAllClients = async () => {
  try {
    const clientsRef = getUserCollection('clients');
    const querySnapshot = await getDocs(clientsRef);
    
    const clients = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Client[];
    
    return { clients, error: null };
  } catch (error) {
    return { clients: [], error };
  }
};

// Add a technology to a client
export const addTechnology = async (clientId: string, technology: Omit<Technology, 'id'>) => {
  try {
    const techsRef = getUserCollection('technologies');
    const newTechRef = doc(techsRef);
    
    await setDoc(newTechRef, {
      ...technology,
      clientId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { 
      id: newTechRef.id, 
      error: null 
    };
  } catch (error) {
    return { id: null, error };
  }
};

// Get technologies for a client
export const getClientTechnologies = async (clientId: string) => {
  try {
    const techsRef = getUserCollection('technologies');
    const q = query(techsRef, where('clientId', '==', clientId));
    const querySnapshot = await getDocs(q);
    
    const technologies = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Technology[];
    
    return { technologies, error: null };
  } catch (error) {
    return { technologies: [], error };
  }
};

// Update a technology
export const updateTechnology = async (id: string, technologyData: Partial<Technology>) => {
  try {
    const techRef = doc(getUserCollection('technologies'), id);
    
    await updateDoc(techRef, {
      ...technologyData,
      updatedAt: serverTimestamp()
    });
    
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error };
  }
};

// Delete a technology
export const deleteTechnology = async (id: string) => {
  try {
    const techRef = doc(getUserCollection('technologies'), id);
    await deleteDoc(techRef);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error };
  }
};
