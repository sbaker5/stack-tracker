/**
 * Type definitions for the Stack Tracker application models
 */

/**
 * Represents a technology type category that can be customized by the user
 */
export interface TechnologyType {
  id: string;
  name: string;  // Display name (e.g., "Frontend")
  value: string; // Unique identifier (e.g., "frontend")
  description?: string;
  icon?: string; // Icon identifier
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

/**
 * Represents a specific technology used by a client
 */
export interface Technology {
  id: string;
  name: string;
  type: string; // References TechnologyType.value
  description: string;
  clientId: string;
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  description: string;
  stack?: Technology[];
  tags: string[];
  flags: string[];
  createdAt?: any; // Firestore Timestamp
  updatedAt?: any; // Firestore Timestamp
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}
