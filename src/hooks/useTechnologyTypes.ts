import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { TechnologyType } from '../types/models';
import { initializeDefaultTechnologyTypes } from '../firebase/technologyTypes';

/**
 * Hook to fetch and manage technology types
 * 
 * @returns Object containing technology types, loading state, and error
 */
export const useTechnologyTypes = () => {
  const [techTypes, setTechTypes] = useState<TechnologyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setLoading(false);
      setError('User authentication required. Please sign in.');
      return;
    }

    // Initialize default technology types if none exist
    const initialize = async () => {
      try {
        await initializeDefaultTechnologyTypes();
      } catch (err) {
        console.error('Error initializing technology types:', err);
        setError('Failed to initialize technology types. Please check your Firebase permissions.');
      }
    };
    
    initialize();

    // Set up real-time listener for technology types
    const techTypesRef = collection(db, 'users', userId, 'technologyTypes');
    const q = query(techTypesRef);
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const techTypesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as TechnologyType[];
        
        // Sort by name for consistent display
        techTypesData.sort((a, b) => a.name.localeCompare(b.name));
        
        setTechTypes(techTypesData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching technology types:', err);
        setError('Failed to load technology types. Please try again.');
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return { techTypes, loading, error };
};
