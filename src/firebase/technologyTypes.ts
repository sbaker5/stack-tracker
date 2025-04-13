import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  DocumentReference
} from 'firebase/firestore';
import { db, auth } from './config';
import { TechnologyType } from '../types/models';

// Get the user's technology types collection reference
const getTechTypesCollection = () => {
  const userId = auth.currentUser?.uid;
  if (!userId) {
    console.error('User not authenticated when accessing technology types');
    throw new Error('User not authenticated');
  }
  return collection(db, 'users', userId, 'technologyTypes');
};

/**
 * Add a new technology type
 * 
 * @param techType Technology type data without id
 * @returns Object containing id of created type or error
 */
export const addTechnologyType = async (techType: Omit<TechnologyType, 'id'>) => {
  try {
    const techTypesRef = getTechTypesCollection();
    const newTechTypeRef = doc(techTypesRef);
    
    await setDoc(newTechTypeRef, {
      ...techType,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { 
      id: newTechTypeRef.id, 
      error: null 
    };
  } catch (error) {
    return { id: null, error };
  }
};

/**
 * Update an existing technology type
 * 
 * @param id ID of the technology type to update
 * @param techTypeData Partial technology type data to update
 * @returns Object indicating success or error
 */
export const updateTechnologyType = async (id: string, techTypeData: Partial<TechnologyType>) => {
  try {
    const techTypeRef = doc(getTechTypesCollection(), id);
    
    await updateDoc(techTypeRef, {
      ...techTypeData,
      updatedAt: serverTimestamp()
    });
    
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error };
  }
};

/**
 * Delete a technology type
 * 
 * @param id ID of the technology type to delete
 * @returns Object indicating success or error
 */
export const deleteTechnologyType = async (id: string) => {
  try {
    const techTypeRef = doc(getTechTypesCollection(), id);
    await deleteDoc(techTypeRef);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error };
  }
};

/**
 * Get a single technology type by ID
 * 
 * @param id ID of the technology type to retrieve
 * @returns Object containing the technology type or error
 */
export const getTechnologyType = async (id: string) => {
  try {
    const techTypeRef = doc(getTechTypesCollection(), id);
    const techTypeSnap = await getDoc(techTypeRef);
    
    if (techTypeSnap.exists()) {
      return { 
        techType: { id: techTypeSnap.id, ...techTypeSnap.data() } as TechnologyType, 
        error: null 
      };
    } else {
      return { techType: null, error: 'Technology type not found' };
    }
  } catch (error) {
    return { techType: null, error };
  }
};

/**
 * Get all technology types
 * 
 * @returns Object containing array of technology types or error
 */
export const getAllTechnologyTypes = async () => {
  try {
    const techTypesRef = getTechTypesCollection();
    const querySnapshot = await getDocs(techTypesRef);
    
    const techTypes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TechnologyType[];
    
    return { techTypes, error: null };
  } catch (error) {
    return { techTypes: [], error };
  }
};

/**
 * Initialize default technology types if none exist
 * 
 * @returns Object indicating success or error
 */
export const initializeDefaultTechnologyTypes = async () => {
  try {
    const { techTypes } = await getAllTechnologyTypes();
    
    // Only initialize if no technology types exist
    if (techTypes.length === 0) {
      const defaultTypes = [
        {
          name: 'Frontend',
          value: 'frontend',
          description: 'User interface technologies',
          icon: 'code'
        },
        {
          name: 'Backend',
          value: 'backend',
          description: 'Server-side technologies',
          icon: 'storage'
        },
        {
          name: 'Database',
          value: 'database',
          description: 'Data storage technologies',
          icon: 'storage'
        },
        {
          name: 'Cloud',
          value: 'cloud',
          description: 'Cloud infrastructure technologies',
          icon: 'cloud'
        },
        {
          name: 'Security',
          value: 'security',
          description: 'Security and authentication technologies',
          icon: 'security'
        }
      ];
      
      // Add each default type
      for (const type of defaultTypes) {
        await addTechnologyType(type);
      }
      
      return { success: true, error: null };
    }
    
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error };
  }
};
