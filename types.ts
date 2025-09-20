export enum Category {
  PORTRAITS = 'Portraits',
  LANDSCAPES = 'Landscapes',
  EVENTS = 'Events',
}

export interface Photo {
  id: string;
  src: string;
  title: string;
  category: Category;
  storagePath: string; // Path to the file in Firebase Storage for deletion
  caption?: string;
  isArchived?: boolean;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  replied: boolean;
}