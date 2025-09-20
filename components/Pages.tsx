import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category, Photo } from '../types';
import { SiteContext, LightboxContext } from '../App';

// Reusable PhotoGrid Component
const PhotoGrid: React.FC<{ photos: Photo[] }> = ({ photos }) => {
  const { openLightbox } = useContext(LightboxContext);

  if (photos.length === 0) {
    return <p className="text-center text-teal-600">No photos in this category yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          className="relative overflow-hidden aspect-w-1 aspect-h-1 group cursor-pointer"
          onClick={() => openLightbox(photo, photos)}
        >
          <img
            src={photo.src}
            alt={photo.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-in-out"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <h3 className="text-white text-lg font-bold">{photo.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};


export const HomePage: React.FC = () => {
  const { photos, heroData } = useContext(SiteContext);
  const activePhotos = photos.filter(p => !p.isArchived);
  const featuredPhotos = activePhotos.slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[400px] bg-cover bg-center flex items-center justify-center text-white" style={{ backgroundImage: `url('${heroData.src}')` }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative text-center z-10 p-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight drop-shadow-lg">{heroData.title}</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow">{heroData.subtitle}</p>
          <Link to="/portfolio" className="mt-8 inline-block bg-[#FFFF94] hover:bg-yellow-300 text-teal-900 font-bold py-3 px-8 rounded-full transition-transform duration-300 hover:scale-105">
            View My Work
          </Link>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="py-16 sm:py-24 bg-[#B8FFA1]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-center text-teal-900 mb-12">Featured Work</h2>
          {featuredPhotos.length > 0 ? (
             <PhotoGrid photos={featuredPhotos} />
          ) : (
            <p className="text-center text-teal-600">No featured photos yet. Upload some in the admin panel!</p>
          )}
        </div>
      </section>
    </div>
  );
};

export const PortfolioPage: React.FC = () => {
  const { photos } = useContext(SiteContext);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');

  const activePhotos = photos.filter(p => !p.isArchived);
  
  const categories: (Category | 'All')[] = ['All', ...Object.values(Category)];

  const filteredPhotos = activeCategory === 'All'
    ? activePhotos
    : activePhotos.filter(p => p.category === activeCategory);

  const categoryButtonClasses = "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B8FFA1]";
  const activeCategoryButtonClasses = "bg-[#FFFF94] text-teal-900 shadow";
  const inactiveCategoryButtonClasses = "bg-white text-teal-800 hover:bg-[#FFFF94]";
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <h1 className="text-5xl font-serif font-bold text-center text-teal-900 mb-6">Portfolio</h1>
      <p className="text-center text-lg text-teal-700 max-w-3xl mx-auto mb-12">
        A curated collection of my work, from intimate portraits to sweeping landscapes.
      </p>

      <div className="flex justify-center flex-wrap gap-3 mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`${categoryButtonClasses} ${activeCategory === cat ? activeCategoryButtonClasses : inactiveCategoryButtonClasses}`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <PhotoGrid photos={filteredPhotos} />
    </div>
  );
};

export const AboutPage: React.FC = () => {
  const { aboutContent } = useContext(SiteContext);
  const { openLightbox } = useContext(LightboxContext);

  const handlePortraitClick = () => {
    const portraitAsPhoto: Photo = {
      id: 'portrait-headshot',
      src: aboutContent.headshotSrc,
      title: 'Alicia R.',
      category: Category.PORTRAITS,
      caption: 'A portrait of the photographer.',
      storagePath: ''
    };
    openLightbox(portraitAsPhoto, [portraitAsPhoto]);
  };
  
  return (
    <div className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="order-2 md:order-1 bg-white/50 backdrop-blur-sm p-8 lg:p-12 rounded-lg border border-[#B8FFA1] shadow-lg">
            <h1 className="text-5xl font-serif font-bold text-teal-900 mb-6">{aboutContent.title}</h1>
            <div className="text-teal-700 space-y-4 text-lg leading-relaxed">
              {aboutContent.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
          <div 
            className="order-1 md:order-2 rounded-lg shadow-xl overflow-hidden border-4 border-transparent hover:border-[#FFFF94] transition-all duration-300 ease-in-out cursor-pointer"
            onClick={handlePortraitClick}
          >
            <img 
              src={aboutContent.headshotSrc}
              alt="Portrait of Alicia R."
              className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500 ease-in-out"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
    const { addMessage } = useContext(SiteContext);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            await addMessage({ name: formData.name, email: formData.email, message: formData.message });
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error("Failed to send message:", error);
            setStatus('error');
        }
    };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="text-center">
        <h1 className="text-5xl font-serif font-bold text-teal-900 mb-4">Get In Touch</h1>
        <p className="text-lg text-teal-700 max-w-2xl mx-auto">
          I'd love to hear about your project or event. Fill out the form below or email me directly.
        </p>
      </div>

      <div className="mt-12 bg-[#B8FFA1]/70 p-8 sm:p-12 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6">
                <div>
                    <label htmlFor="name" className="sr-only">Full name</label>
                    <input type="text" name="name" id="name" autoComplete="name" required value={formData.name} onChange={handleChange} className="block w-full shadow-sm py-3 px-4 placeholder-teal-500 focus:ring-[#B8FFA1] focus:border-[#B8FFA1] border-[#FFFF94] rounded-md" placeholder="Full name"/>
                </div>
                <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className="block w-full shadow-sm py-3 px-4 placeholder-teal-500 focus:ring-[#B8FFA1] focus:border-[#B8FFA1] border-[#FFFF94] rounded-md" placeholder="Email"/>
                </div>
                <div>
                    <label htmlFor="message" className="sr-only">Message</label>
                    <textarea id="message" name="message" rows={4} required value={formData.message} onChange={handleChange} className="block w-full shadow-sm py-3 px-4 placeholder-teal-500 focus:ring-[#B8FFA1] focus:border-[#B8FFA1] border-[#FFFF94] rounded-md" placeholder="Message"></textarea>
                </div>
                <div>
                    <button type="submit" disabled={status === 'submitting'} className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-teal-900 bg-[#FFFF94] hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B8FFA1] disabled:bg-yellow-200">
                        {status === 'submitting' ? 'Sending...' : 'Send Message'}
                    </button>
                </div>
                {status === 'success' && <p className="text-center text-green-600">Thank you! Your message has been sent.</p>}
                {status === 'error' && <p className="text-center text-red-600">Sorry, something went wrong. Please try again.</p>}
            </div>
        </form>
      </div>
    </div>
  );
};