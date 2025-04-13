import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { Client, Technology } from '../types/models';
import { getAllClients, getClientTechnologies } from '../firebase/clients';

// Hook to fetch all clients
export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const clientsRef = collection(db, 'users', userId, 'clients');
    
    // Set up real-time listener for clients
    const unsubscribe = onSnapshot(
      clientsRef,
      (snapshot) => {
        const clientsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Client[];
        
        setClients(clientsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching clients:', err);
        setError('Failed to load clients. Please try again.');
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return { clients, loading, error };
};

// Hook to fetch a single client with its technologies
export const useClient = (clientId: string | null) => {
  const [client, setClient] = useState<Client | null>(null);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId || !auth.currentUser?.uid) {
      setLoading(false);
      return;
    }

    const fetchClientData = async () => {
      setLoading(true);
      
      try {
        // Get client data
        const userId = auth.currentUser?.uid;
        const clientRef = doc(db, 'users', userId!, 'clients', clientId);
        const clientSnap = await getDoc(clientRef);
        
        if (clientSnap.exists()) {
          const clientData = { id: clientSnap.id, ...clientSnap.data() } as Client;
          setClient(clientData);
          
          // Get technologies for this client
          const techsRef = collection(db, 'users', userId!, 'technologies');
          const q = query(techsRef);
          
          const unsubscribeTechs = onSnapshot(
            q,
            (snapshot) => {
              const techsData = snapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter((tech) => (tech as any).clientId === clientId) as Technology[];
              
              setTechnologies(techsData);
              setLoading(false);
            },
            (err) => {
              console.error('Error fetching technologies:', err);
              setError('Failed to load technologies. Please try again.');
              setLoading(false);
            }
          );
          
          return () => unsubscribeTechs();
        } else {
          setClient(null);
          setTechnologies([]);
          setError('Client not found');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error in useClient hook:', err);
        setError('Failed to load client data. Please try again.');
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  return { client, technologies, loading, error };
};
