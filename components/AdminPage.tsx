import React, { useState, useContext } from 'react';
import { SiteContext, AuthContext } from '../App';
import { Category, Photo, Message } from '../types';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Design Editor Component
const DesignEditor: React.FC = () => {
    const { siteBgColor, updateSiteBgColor, logo, updateLogo, removeLogo } = useContext(SiteContext);
    const [currentColor, setCurrentColor] = useState(siteBgColor);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');

    const handleApply = async () => {
        setStatus('saving');
        await updateSiteBgColor(currentColor);
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = async () => {
                await updateLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-[#B8FFA1] p-8 rounded-lg shadow-md w-full mb-12">
            <h2 className="text-3xl font-serif font-bold text-teal-900 mb-6">Site Design</h2>
            <div className="space-y-4">
                <label htmlFor="bg-color-picker" className="block text-sm font-medium text-teal-800">
                    Page Background Color
                </label>
                <div className="flex items-center space-x-4">
                     <input
                        id="bg-color-picker"
                        type="color"
                        value={currentColor}
                        onChange={(e) => setCurrentColor(e.target.value)}
                        className="w-16 h-10 p-1 bg-white border border-teal-300 rounded-md cursor-pointer"
                    />
                    <span className="font-mono text-teal-700">{currentColor}</span>
                </div>
                 <div className="flex items-center space-x-4 pt-2">
                    <button onClick={handleApply} disabled={status === 'saving'} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-teal-900 bg-[#FFFF94] hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B8FFA1] disabled:bg-yellow-200">
                        {status === 'saving' ? 'Applying...' : 'Apply Color'}
                    </button>
                    {status === 'success' && <p className="text-sm text-green-600">Background color updated!</p>}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#FFFF94]/80">
                <h3 className="text-xl font-serif text-teal-900 mb-4">Site Logo</h3>
                 {logo ? (
                    <div className="flex items-center space-x-6">
                        <img src={logo} alt="Site Logo" className="h-14 w-auto bg-white/80 p-2 rounded-md shadow" />
                        <button 
                            onClick={removeLogo} 
                            className="py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                        >
                            Remove Logo
                        </button>
                    </div>
                ) : (
                    <div>
                        <label htmlFor="logo-upload" className="block text-sm font-medium text-teal-800 mb-2">
                            Upload a logo to replace the text in the header.
                        </label>
                        <input
                            id="logo-upload"
                            type="file"
                            accept="image/png, image/jpeg, image/svg+xml"
                            onChange={handleLogoUpload}
                            className="block w-full text-sm text-teal-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-800 hover:file:bg-[#FFFF94]"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

// About Page Editor Component
const AboutEditor: React.FC = () => {
    const { aboutContent, updateAboutContent } = useContext(SiteContext);
    const [title, setTitle] = useState(aboutContent.title);
    const [paragraphs, setParagraphs] = useState(aboutContent.paragraphs.join('\n\n'));
    const [headshotPreview, setHeadshotPreview] = useState(aboutContent.headshotSrc);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setHeadshotPreview(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('saving');
        await updateAboutContent({
            title,
            paragraphs: paragraphs.split('\n\n').filter(p => p.trim() !== ''),
            headshotSrc: headshotPreview
        });
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
    };

    return (
        <div className="bg-[#B8FFA1] p-8 rounded-lg shadow-md w-full mb-12">
            <h2 className="text-3xl font-serif font-bold text-teal-900 mb-6">Edit About Page</h2>
             <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="headshot-upload" className="block text-sm font-medium text-teal-800">Your Headshot</label>
                    {headshotPreview && <img src={headshotPreview} alt="Headshot preview" className="mt-2 rounded-lg object-cover w-32 h-32" />}
                    <input id="headshot-upload" type="file" accept="image/*" onChange={handleFileChange} className="mt-2 block w-full text-sm text-teal-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-800 hover:file:bg-[#FFFF94]" />
                </div>
                <div>
                    <label htmlFor="about-title" className="block text-sm font-medium text-teal-800">Title</label>
                    <input type="text" name="about-title" id="about-title" required value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full shadow-sm py-2 px-3 border border-teal-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500 bg-white" />
                </div>
                 <div>
                    <label htmlFor="about-paragraphs" className="block text-sm font-medium text-teal-800">Content</label>
                    <p className="text-xs text-teal-600">Separate paragraphs with two newlines (press Enter twice).</p>
                    <textarea name="about-paragraphs" id="about-paragraphs" rows={8} required value={paragraphs} onChange={e => setParagraphs(e.target.value)} className="mt-1 block w-full shadow-sm py-2 px-3 border border-teal-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500 bg-white"></textarea>
                </div>
                <div className="flex items-center space-x-4">
                    <button type="submit" disabled={status === 'saving'} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-teal-900 bg-[#FFFF94] hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B8FFA1] disabled:bg-yellow-200">
                        {status === 'saving' ? 'Saving...' : 'Save About Page'}
                    </button>
                    {status === 'success' && <p className="text-sm text-green-600">About page updated!</p>}
                </div>
            </form>
        </div>
    )
}

// Mailbox Component
const Mailbox: React.FC = () => {
    const { messages, toggleMessageReplied } = useContext(SiteContext);

    return (
        <div className="bg-[#B8FFA1] p-8 rounded-lg shadow-md w-full">
            <h2 className="text-3xl font-serif font-bold text-teal-900 mb-6">Mailbox</h2>
            {messages.length === 0 ? (
                <p className="text-teal-700">No messages yet.</p>
            ) : (
                <div className="space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`p-4 rounded-md border ${msg.replied ? 'bg-yellow-100 border-[#FFFF94] opacity-70' : 'bg-white border-[#D1FFFC]'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-teal-800">{msg.name} <span className="font-normal text-teal-600">&lt;{msg.email}&gt;</span></p>
                                    <p className="text-xs text-teal-500">{new Date(msg.timestamp).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <a href={`mailto:${msg.email}`} className="text-sm font-medium text-teal-700 hover:text-teal-900">Reply</a>
                                    <label htmlFor={`replied-${msg.id}`} className="flex items-center space-x-1 cursor-pointer text-sm text-teal-700">
                                        <input type="checkbox" id={`replied-${msg.id}`} checked={msg.replied} onChange={() => toggleMessageReplied(msg.id, msg.replied)} className="h-4 w-4 rounded border-gray-300 text-teal-800 focus:ring-[#B8FFA1]" />
                                        <span>Replied</span>
                                    </label>
                                </div>
                            </div>
                            <p className="mt-3 text-teal-700 whitespace-pre-wrap">{msg.message}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Hero Section Editor Component
const HeroEditor: React.FC = () => {
    const { heroData, updateHeroData } = useContext(SiteContext);
    
    const [title, setTitle] = useState(heroData.title);
    const [subtitle, setSubtitle] = useState(heroData.subtitle);
    const [preview, setPreview] = useState<string | null>(heroData.src);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('saving');
        await updateHeroData({ title, subtitle, src: preview ?? heroData.src });
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
    };

    return (
        <div className="bg-[#B8FFA1] p-8 rounded-lg shadow-md w-full mb-12">
            <h2 className="text-3xl font-serif font-bold text-teal-900 mb-6">Edit Home Page Hero</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label htmlFor="hero-image-upload" className="block text-sm font-medium text-teal-800">Hero Background Image</label>
                    {preview && <img src={preview} alt="Hero preview" className="mt-2 rounded-lg object-cover w-full h-32" />}
                    <input id="hero-image-upload" type="file" accept="image/*" onChange={handleFileChange} className="mt-2 block w-full text-sm text-teal-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-800 hover:file:bg-[#FFFF94]" />
                </div>
                <div>
                    <label htmlFor="hero-title" className="block text-sm font-medium text-teal-800">Hero Title</label>
                    <input type="text" id="hero-title" required value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full shadow-sm py-2 px-3 border border-teal-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500 bg-white" />
                </div>
                <div>
                    <label htmlFor="hero-subtitle" className="block text-sm font-medium text-teal-800">Hero Subtitle</label>
                    <input type="text" id="hero-subtitle" required value={subtitle} onChange={e => setSubtitle(e.target.value)} className="mt-1 block w-full shadow-sm py-2 px-3 border border-teal-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500 bg-white" />
                </div>
                <div className="flex items-center space-x-4">
                    <button type="submit" disabled={status === 'saving'} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-teal-900 bg-[#FFFF94] hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B8FFA1] disabled:bg-yellow-200">
                        {status === 'saving' ? 'Saving...' : 'Save Hero Section'}
                    </button>
                    {status === 'success' && <p className="text-sm text-green-600">Hero section updated!</p>}
                </div>
            </form>
        </div>
    );
};

// Edit Photo Modal Component
const EditPhotoModal: React.FC<{
    photo: Photo;
    onSave: (updates: Partial<Omit<Photo, 'id'>>) => void;
    onClose: () => void;
}> = ({ photo, onSave, onClose }) => {
    const [title, setTitle] = useState(photo.title);
    const [category, setCategory] = useState<Category>(photo.category);
    const [caption, setCaption] = useState(photo.caption || '');

    const handleSave = () => { onSave({ title, category, caption }); };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#D1FFFC] rounded-lg shadow-xl p-8 w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-serif font-bold text-teal-900 mb-6">Edit Photo</h3>
                <button onClick={onClose} className="absolute top-4 right-4 text-teal-600 hover:text-teal-900 text-3xl font-light leading-none">&times;</button>
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                     <div><img src={photo.src} alt="Preview" className="h-40 w-auto object-cover rounded-md mx-auto" /></div>
                     <div>
                        <label htmlFor="edit-title" className="block text-sm font-medium text-teal-800">Title</label>
                        <input type="text" id="edit-title" required value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full shadow-sm py-2 px-3 border border-teal-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500 bg-white" />
                    </div>
                    <div>
                        <label htmlFor="edit-category" className="block text-sm font-medium text-teal-800">Category</label>
                        <select id="edit-category" value={category} onChange={e => setCategory(e.target.value as Category)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-teal-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md bg-white">
                            {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="edit-caption" className="block text-sm font-medium text-teal-800">Caption (Optional)</label>
                        <textarea id="edit-caption" rows={3} value={caption} onChange={e => setCaption(e.target.value)} className="mt-1 block w-full shadow-sm py-2 px-3 border border-teal-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500 bg-white"></textarea>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 border border-teal-300 rounded-md shadow-sm text-sm font-medium text-teal-800 bg-white hover:bg-teal-50">Cancel</button>
                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-teal-900 bg-[#FFFF94] hover:bg-yellow-300">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Photo Management Component
const PhotoManager: React.FC = () => {
    const { photos, deletePhoto, editPhoto, toggleArchivePhoto } = useContext(SiteContext);
    const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
    
    const activePhotos = photos.filter(p => !p.isArchived);
    const archivedPhotos = photos.filter(p => p.isArchived);

    const handleSaveEdit = (updates: Partial<Omit<Photo, 'id'>>) => {
        if (editingPhoto) editPhoto(editingPhoto.id, updates);
        setEditingPhoto(null);
    };

    const handleDelete = (photo: Photo) => {
        if (window.confirm(`Are you sure you want to permanently delete "${photo.title}"?`)) {
            deletePhoto(photo);
        }
    };

    const PhotoCard: React.FC<{photo: Photo; isArchivedView?: boolean}> = ({ photo, isArchivedView }) => (
         <div className="relative group bg-white rounded-lg shadow-md overflow-hidden">
            <img src={photo.src} alt={photo.title} className="w-full h-48 object-cover" />
            <div className="p-3">
                <p className="font-bold text-teal-800 truncate">{photo.title}</p>
                <p className="text-sm text-teal-600">{photo.category}</p>
            </div>
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 space-y-2">
                <button onClick={() => setEditingPhoto(photo)} className="w-full text-center py-2 px-3 bg-[#FFFF94] text-teal-900 text-sm font-semibold rounded-md hover:bg-yellow-300">Edit</button>
                <button onClick={() => toggleArchivePhoto(photo.id, photo.isArchived || false)} className="w-full text-center py-2 px-3 bg-white text-teal-800 text-sm font-semibold rounded-md hover:bg-gray-200">
                    {isArchivedView ? 'Publish' : 'Archive'}
                </button>
                <button onClick={() => handleDelete(photo)} className="w-full text-center py-2 px-3 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600">Delete</button>
            </div>
        </div>
    );

    return (
        <div className="bg-[#B8FFA1] p-8 rounded-lg shadow-md w-full">
            <h2 className="text-3xl font-serif font-bold text-teal-900 mb-6">Manage Photos</h2>
            <section>
                <h3 className="text-2xl font-serif text-teal-800 mb-4 border-b border-[#FFFF94] pb-2">Active Photos ({activePhotos.length})</h3>
                {activePhotos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {activePhotos.map(p => <PhotoCard key={p.id} photo={p} />)}
                    </div>
                ) : <p className="text-teal-700">No active photos.</p>}
            </section>
            <section className="mt-12">
                <h3 className="text-2xl font-serif text-teal-800 mb-4 border-b border-[#FFFF94] pb-2">Archived Photos ({archivedPhotos.length})</h3>
                 {archivedPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {archivedPhotos.map(p => <PhotoCard key={p.id} photo={p} isArchivedView />)}
                    </div>
                ) : <p className="text-teal-700">No archived photos.</p>}
            </section>
            {editingPhoto && <EditPhotoModal photo={editingPhoto} onSave={handleSaveEdit} onClose={() => setEditingPhoto(null)} />}
        </div>
    );
};

// AdminUploader Component
const AdminUploader: React.FC = () => {
    const { addPhoto } = useContext(SiteContext);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<Category>(Category.PORTRAITS);
    const [caption, setCaption] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success'>('idle');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!preview || !title) return alert('Please select a file and provide a title.');
        setStatus('uploading');
        try {
            await addPhoto({ src: preview, title, category, caption });
            setStatus('success');
            setTitle('');
            setCategory(Category.PORTRAITS);
            setCaption('');
            setPreview(null);
            (e.target as HTMLFormElement).reset();
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            console.error("Upload failed:", error);
            setStatus('idle');
            alert("Upload failed. Please try again.");
        }
    };

    return (
        <div className="bg-[#B8FFA1] p-8 rounded-lg shadow-md w-full mb-12">
            <h2 className="text-3xl font-serif font-bold text-teal-900 mb-6">Upload New Photo</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="photo-upload" className="block text-sm font-medium text-teal-800">Photo</label>
                    <div className="mt-1 flex items-center space-x-4">
                        {preview ? <img src={preview} alt="Preview" className="h-20 w-20 object-cover rounded-md" /> : <div className="h-20 w-20 bg-yellow-100 rounded-md"></div>}
                        <input id="photo-upload" type="file" accept="image/*" required onChange={handleFileChange} className="block w-full text-sm text-teal-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-100 file:text-yellow-800 hover:file:bg-[#FFFF94]"/>
                    </div>
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-teal-800">Title</label>
                    <input type="text" id="title" required value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full shadow-sm py-2 px-3 border border-teal-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500 bg-white" />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-teal-800">Category</label>
                    <select id="category" value={category} onChange={e => setCategory(e.target.value as Category)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-teal-600 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md bg-white">
                        {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="caption" className="block text-sm font-medium text-teal-800">Caption (Optional)</label>
                    <textarea id="caption" rows={3} value={caption} onChange={e => setCaption(e.target.value)} className="mt-1 block w-full shadow-sm py-2 px-3 border border-teal-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500 bg-white"></textarea>
                </div>
                <div className="flex items-center space-x-4">
                    <button type="submit" disabled={status === 'uploading'} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-teal-900 bg-[#FFFF94] hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B8FFA1] disabled:bg-yellow-200">
                        {status === 'uploading' ? 'Uploading...' : 'Upload Photo'}
                    </button>
                    {status === 'success' && <p className="text-sm text-green-600">Photo uploaded successfully!</p>}
                </div>
            </form>
        </div>
    );
};

// Login Component
const AuthLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError('Failed to sign in. Please check your credentials.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#B8FFA1] p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-serif font-bold text-teal-900 mb-6 text-center">Admin Login</h1>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-teal-800">Email Address</label>
                        <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-teal-300 rounded-md shadow-sm placeholder-teal-400 focus:outline-none focus:ring-[#FFFF94] focus:border-[#FFFF94]"/>
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-teal-800">Password</label>
                        <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-teal-300 rounded-md shadow-sm placeholder-teal-400 focus:outline-none focus:ring-[#FFFF94] focus:border-[#FFFF94]"/>
                    </div>
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    <div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-teal-900 bg-[#FFFF94] hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B8FFA1] disabled:bg-yellow-200">
                           {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// AdminPage Wrapper
export const AdminPage: React.FC = () => {
    const { currentUser, loading } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('Content');

    const handleLogout = () => signOut(auth);
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'Content': return <><HeroEditor /><AboutEditor /></>;
            case 'Photos': return <><AdminUploader /><PhotoManager /></>;
            case 'Mailbox': return <Mailbox />;
            case 'Design': return <DesignEditor />;
            default: return null;
        }
    };

    const TabButton: React.FC<{ name: string }> = ({ name }) => (
        <button
            onClick={() => setActiveTab(name)}
            className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors duration-300 ${activeTab === name ? 'bg-[#B8FFA1] text-teal-800' : 'bg-[#B8FFA1]/50 text-teal-600 hover:bg-[#FFFF94]'}`}
        >{name}</button>
    );

    if (loading) {
        return <div className="text-center py-20">Loading...</div>;
    }

    if (currentUser) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center border-b border-[#B8FFA1] mb-px">
                    <div className="flex">
                        <TabButton name="Content" />
                        <TabButton name="Photos" />
                        <TabButton name="Mailbox" />
                        <TabButton name="Design" />
                    </div>
                    <button onClick={handleLogout} className="text-sm font-medium text-teal-700 hover:text-teal-900 pr-2">Logout</button>
                </div>
                <div className="w-full">{renderTabContent()}</div>
            </div>
        );
    }
    
    return <AuthLogin />;
};
