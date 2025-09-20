import React, { useState, useEffect, createContext, useCallback } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Photo, Message } from './types';
import { Layout } from './components/Layout';
import { HomePage, PortfolioPage, AboutPage, ContactPage } from './components/Pages';
import { AdminPage } from './components/AdminPage';
import Lightbox from './components/Lightbox';
import { db, storage, auth } from './firebase';
import { collection, getDocs, doc, setDoc, addDoc, deleteDoc, updateDoc, Timestamp, orderBy, query } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { onAuthStateChanged, User } from 'firebase/auth';

// --- Types ---
interface HeroData {
  src: string;
  title: string;
  subtitle: string;
}

interface AboutContent {
  title: string;
  paragraphs: string[];
  headshotSrc: string;
}

// --- Context for Site Data ---
interface SiteContextType {
  photos: Photo[];
  addPhoto: (photoData: { src: string; title: string; category: string; caption?: string }) => Promise<void>;
  deletePhoto: (photo: Photo) => Promise<void>;
  editPhoto: (id: string, updates: Partial<Omit<Photo, 'id'>>) => Promise<void>;
  toggleArchivePhoto: (id: string, isArchived: boolean) => Promise<void>;
  heroData: HeroData;
  updateHeroData: (data: Partial<HeroData>) => Promise<void>;
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'replied'>) => Promise<void>;
  toggleMessageReplied: (id: string, replied: boolean) => Promise<void>;
  aboutContent: AboutContent;
  updateAboutContent: (content: Partial<AboutContent>) => Promise<void>;
  siteBgColor: string;
  updateSiteBgColor: (color: string) => Promise<void>;
  logo: string | null;
  updateLogo: (logoSrc: string) => Promise<void>;
  removeLogo: () => Promise<void>;
}

export const SiteContext = createContext<SiteContextType>({} as SiteContextType);

// --- Context for Lightbox ---
interface LightboxContextType {
  openLightbox: (photo: Photo, photoList: Photo[]) => void;
}
export const LightboxContext = createContext<LightboxContextType>({ openLightbox: () => {} });

// --- Context for Auth ---
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}
export const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true });

// --- ScrollToTop Helper ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// --- Main App Component ---
const App: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [siteBgColor, setSiteBgColor] = useState<string>('#D1FFFC');
  const [logo, setLogo] = useState<string | null>(null);
  const [heroData, setHeroData] = useState<HeroData>({ src: 'https://picsum.photos/id/1015/1800/1000', title: 'Passionfruit Reverie', subtitle: 'Timeless photography that tells your story.'});
  const [aboutContent, setAboutContent] = useState<AboutContent>({ title: 'About Alicia', paragraphs: [], headshotSrc: 'https://picsum.photos/id/1027/600/800' });
  const [lightboxState, setLightboxState] = useState<{ photo: Photo | null; photoList: Photo[] }>({ photo: null, photoList: [] });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);
  
  // Fetch all data from Firestore on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Photos
        const photosQuery = query(collection(db, "photos"), orderBy("id", "desc"));
        const photosSnapshot = await getDocs(photosQuery);
        setPhotos(photosSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Photo[]);

        // Messages
        const messagesQuery = query(collection(db, "messages"), orderBy("timestamp", "desc"));
        const messagesSnapshot = await getDocs(messagesQuery);
        setMessages(messagesSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                id: doc.id,
                timestamp: (data.timestamp as Timestamp).toDate().toISOString(),
            } as Message;
        }));

        // Site Content (Hero, About, etc.)
        const contentDoc = await getDocs(collection(db, 'settings'));
        contentDoc.forEach(doc => {
            if (doc.id === 'heroData') setHeroData(doc.data() as HeroData);
            if (doc.id === 'aboutContent') setAboutContent(doc.data() as AboutContent);
            if (doc.id === 'siteDesign') {
              const design = doc.data();
              setSiteBgColor(design.siteBgColor || '#D1FFFC');
              setLogo(design.logo || null);
            }
        });
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };
    fetchData();
  }, []);

  // Apply background color to body
  useEffect(() => { document.body.style.backgroundColor = siteBgColor; }, [siteBgColor]);
  
  // --- Data Management Functions ---
  const addPhoto = async (photoData: Omit<Photo, 'id' | 'storagePath' | 'isArchived'> & { src: string }) => {
    const id = Timestamp.now().toMillis().toString();
    const storagePath = `photos/${id}`;
    const storageRef = ref(storage, storagePath);
    await uploadString(storageRef, photoData.src, 'data_url');
    const downloadURL = await getDownloadURL(storageRef);
    const newPhoto: Omit<Photo, 'id'> = { ...photoData, src: downloadURL, storagePath, isArchived: false };
    await setDoc(doc(db, "photos", id), newPhoto);
    setPhotos(prev => [{ ...newPhoto, id }, ...prev]);
  };
  
  const deletePhoto = async (photo: Photo) => {
    await deleteDoc(doc(db, "photos", photo.id));
    const storageRef = ref(storage, photo.storagePath);
    await deleteObject(storageRef);
    setPhotos(prev => prev.filter(p => p.id !== photo.id));
  };
  
  const editPhoto = async (id: string, updates: Partial<Omit<Photo, 'id'>>) => {
    await updateDoc(doc(db, "photos", id), updates);
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const toggleArchivePhoto = async (id: string, isArchived: boolean) => {
     await updateDoc(doc(db, "photos", id), { isArchived: !isArchived });
     setPhotos(prev => prev.map(p => p.id === id ? { ...p, isArchived: !p.isArchived } : p));
  };

  const updateSiteSetting = async (docId: string, data: object) => {
     await setDoc(doc(db, "settings", docId), data, { merge: true });
  }

  const updateHeroData = async (data: Partial<HeroData>) => {
    setHeroData(prev => ({...prev, ...data}));
    await updateSiteSetting('heroData', data);
  };
  
  const addMessage = async (message: Omit<Message, 'id' | 'timestamp' | 'replied'>) => {
    const newMessage = { ...message, timestamp: Timestamp.now(), replied: false };
    const docRef = await addDoc(collection(db, "messages"), newMessage);
    setMessages(prev => [{ ...newMessage, id: docRef.id, timestamp: newMessage.timestamp.toDate().toISOString() }, ...prev]);
  };
  
  const toggleMessageReplied = async (id: string, replied: boolean) => {
    await updateDoc(doc(db, "messages", id), { replied: !replied });
    setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, replied: !msg.replied } : msg));
  };
  
  const updateAboutContent = async (content: Partial<AboutContent>) => {
    setAboutContent(prev => ({ ...prev, ...content }));
    await updateSiteSetting('aboutContent', content);
  };
  
  const updateSiteBgColor = async (color: string) => {
    setSiteBgColor(color);
    await updateSiteSetting('siteDesign', { siteBgColor: color });
  };
  
  const updateLogo = async (logoSrc: string) => {
    setLogo(logoSrc);
    await updateSiteSetting('siteDesign', { logo: logoSrc });
  };
  
  const removeLogo = async () => {
    setLogo(null);
    await updateSiteSetting('siteDesign', { logo: null });
  };
  
  const openLightbox = useCallback((photo: Photo, photoList: Photo[]) => {
    setLightboxState({ photo, photoList });
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxState({ photo: null, photoList: [] });
    document.body.style.overflow = 'auto';
  }, []);

  const navigateLightbox = useCallback((direction: 'next' | 'prev') => {
    if (!lightboxState.photo) return;
    const currentIndex = lightboxState.photoList.findIndex(p => p.id === lightboxState.photo!.id);
    let nextIndex;
    if (direction === 'next') {
        nextIndex = (currentIndex + 1) % lightboxState.photoList.length;
    } else {
        nextIndex = (currentIndex - 1 + lightboxState.photoList.length) % lightboxState.photoList.length;
    }
    setLightboxState(prevState => ({ ...prevState, photo: prevState.photoList[nextIndex] }));
  }, [lightboxState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxState.photo) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateLightbox('next');
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxState.photo, closeLightbox, navigateLightbox]);

  return (
    <AuthContext.Provider value={{ currentUser, loading: authLoading }}>
    <SiteContext.Provider value={{ photos, addPhoto, deletePhoto, editPhoto, toggleArchivePhoto, heroData, updateHeroData, messages, addMessage, toggleMessageReplied, aboutContent, updateAboutContent, siteBgColor, updateSiteBgColor, logo, updateLogo, removeLogo }}>
      <LightboxContext.Provider value={{ openLightbox }}>
        <HashRouter>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Layout>
        </HashRouter>
        {lightboxState.photo && (
            <Lightbox 
                photo={lightboxState.photo} 
                onClose={closeLightbox}
                onPrev={() => navigateLightbox('prev')}
                onNext={() => navigateLightbox('next')}
            />
        )}
      </LightboxContext.Provider>
    </SiteContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
