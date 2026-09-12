import React, { useState } from 'react';
import { BlogPost } from '../types';
import { useConfig } from '../lib/ConfigContext';
import { 
  Plus, Edit, Trash2, Eye, Search, Filter, BookOpen, Image as ImageIcon, 
  Calendar, User, Tag, CheckCircle2, FileText, ArrowLeft, ExternalLink, 
  Sparkles, Layers, Globe, Clock, ChevronRight, X, Wand2, Bold, Italic, 
  List, Quote, Code, Heading1, Heading2, Heading3, Share2, ThumbsUp,
  Sliders, Layout, Check, Copy
} from 'lucide-react';
import { cn } from '../lib/utils';

interface BlogAdminViewProps {
  setToast?: (t: { message: string; type: 'success' | 'error' | 'info' }) => void;
}

// Curated high-res Unsplash transportation images for blog posts
const CURATED_UNSPLASH_IMAGES = [
  {
    title: 'Yellow City Taxi Fleet',
    category: 'Taxi & Cab Fleet',
    url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'Luxury Executive Sedan',
    category: 'Airport Transfers',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'Night Highway Cab Journey',
    category: 'Safety & Mobility',
    url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'Modern Airport Terminal',
    category: 'Airport Transfers',
    url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'Electric Taxi Charging',
    category: 'Sustainability',
    url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'City Street Traffic Day',
    category: 'Intercity Journeys',
    url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'Friendly Driver Partner',
    category: 'Driver Fleet',
    url: 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&q=80&w=1200'
  },
  {
    title: 'Smartphone Booking App',
    category: 'Promotions',
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200'
  }
];

export const BlogAdminView: React.FC<BlogAdminViewProps> = ({ setToast }) => {
  const { config, updateConfig } = useConfig();
  const blogs: BlogPost[] = config.blogsList || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'cover' | 'body'>('cover');

  // Form state
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000',
    category: 'Safety & Mobility',
    author: 'Admin Editorial Desk',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    readTime: '4 min read',
    tags: ['Taxi', 'App', 'Rides', 'Safety'],
    status: 'Published'
  });

  const categories = ['All', 'Safety & Mobility', 'Airport Transfers', 'Driver Fleet', 'Intercity Journeys', 'Sustainability', 'Promotions'];

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = (b.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (b.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setFormData({
      id: `blog_${Date.now()}`,
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000',
      category: 'Safety & Mobility',
      author: 'Editorial Desk',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readTime: '4 min read',
      tags: ['Safety', 'Rides', 'Taxi'],
      status: 'Published',
      views: 0
    });
    setEditingBlog(null);
    setIsCreating(true);
  };

  const handleOpenEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setFormData({ ...blog });
    setIsCreating(false);
  };

  const handleDeleteBlog = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      const updated = blogs.filter(b => b.id !== id);
      updateConfig({ blogsList: updated });
      if (setToast) setToast({ message: 'Blog article deleted successfully', type: 'info' });
      if (editingBlog?.id === id) {
        setEditingBlog(null);
        setIsCreating(false);
      }
    }
  };

  // Helper for text formatting tools
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('blog-content-area') as HTMLTextAreaElement;
    if (!textarea) {
      setFormData(prev => ({ ...prev, content: (prev.content || '') + `\n${prefix}text${suffix}` }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setFormData(prev => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  // AI Content Generator Actions
  const handleAiDraftArticle = () => {
    const title = formData.title || 'Mastering Urban Taxi Travel: Top Tips for Fast & Safe Journeys';
    const category = formData.category || 'Safety & Mobility';

    const aiArticle = `# ${title}

## Introduction
Navigating bustling city streets efficiently requires a mix of smart planning and reliable mobility services. Whether you're commuting to work, catching an early morning flight, or heading home after a night out, staying informed ensures your ride is smooth and stress-free.

![City Taxi Fleet](https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000)

## Key Mobility Highlights
- **Real-Time GPS Tracking**: Always inspect your live route on the map before stepping into the vehicle.
- **Verified Driver Badges**: Ensure the driver's name, photo, and license plate match your app confirmation.
- **Upfront Pricing Transparency**: Fixed estimations guarantee no hidden surcharges or surprise meters.

> "Safety and reliability are at the heart of modern urban transport. Always verify vehicle credentials and share your live trip status with family."

## 5 Essential Tips for Riders
1. **Pre-Book for Airport Routes**: Avoid rush-hour delays by scheduling your ride 2 hours in advance.
2. **Verify Vehicle License Plate**: Double check the registration plate before opening the passenger door.
3. **Use In-App Emergency SOS**: Take advantage of 1-click live location sharing with trusted contacts.
4. **Choose Eco-Friendly Fleets**: Opt for hybrid or electric vehicle tiers to reduce urban carbon emissions.
5. **Rate & Review Your Experience**: Help maintain high fleet standards by providing constructive post-ride feedback.

## Conclusion
With technology constantly enhancing safety and convenience, taking a cab in the city has never been safer. Plan ahead, double-check trip details, and enjoy a seamless travel experience!`;

    const generatedExcerpt = `Discover essential expert tips for fast, comfortable, and safe urban taxi travel. Learn how GPS tracking and verified drivers make every journey stress-free.`;

    setFormData(prev => ({
      ...prev,
      title,
      excerpt: generatedExcerpt,
      content: aiArticle,
      readTime: '5 min read',
      tags: ['Safety', 'Urban Mobility', 'Taxi Tips', category]
    }));

    if (setToast) setToast({ message: '✨ AI Article Draft & Outline generated successfully!', type: 'success' });
  };

  const handleAiGenerateTitles = () => {
    const titleOptions = [
      '10 Essential Safety Tips Every Taxi Passenger Should Know in 2026',
      'The Ultimate Guide to Stress-Free Airport Cab Transfers',
      'How AI & Real-Time GPS Tracking are Revolutionizing City Mobility',
      'Eco-Friendly Rides: Why Electric Fleets are the Future of Cabs'
    ];
    const picked = titleOptions[Math.floor(Math.random() * titleOptions.length)];
    const slug = picked.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    setFormData(prev => ({ ...prev, title: picked, slug }));
    if (setToast) setToast({ message: '✨ AI Catchy Headline generated!', type: 'info' });
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt) {
      if (setToast) setToast({ message: 'Please provide at least an article title and excerpt', type: 'error' });
      return;
    }

    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newBlog: BlogPost = {
      id: formData.id || `blog_${Date.now()}`,
      title: formData.title || 'Untitled Article',
      slug,
      excerpt: formData.excerpt || '',
      content: formData.content || formData.excerpt || '',
      coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1000',
      category: formData.category || 'Safety & Mobility',
      author: formData.author || 'Admin Editorial Desk',
      date: formData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readTime: formData.readTime || '5 min read',
      tags: typeof formData.tags === 'string' ? (formData.tags as string).split(',').map(s => s.trim()) : (formData.tags || ['Taxi']),
      status: formData.status || 'Published',
      views: formData.views || 0
    };

    let updatedList: BlogPost[];
    if (editingBlog) {
      updatedList = blogs.map(b => b.id === editingBlog.id ? newBlog : b);
    } else {
      updatedList = [newBlog, ...blogs];
    }

    updateConfig({ blogsList: updatedList });
    if (setToast) setToast({ message: editingBlog ? 'Blog article updated successfully!' : 'New blog article published live!', type: 'success' });
    setIsCreating(false);
    setEditingBlog(null);
  };

  // Word & Reading Time stats
  const wordCount = (formData.content || '').trim().split(/\s+/).filter(Boolean).length;
  const estReadTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  return (
    <div className="space-y-6 font-sans">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <BookOpen className="text-amber-500" size={26} />
            <span>Blog & Article Studio</span>
            <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[11px] font-mono font-black">
              {blogs.length} PUBLISHED
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 border border-amber-500/50"
          >
            <Plus size={16} />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout if Editing or Creating */}
      {(isCreating || editingBlog) ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form Column (Left 7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                <FileText size={18} className="text-amber-500" />
                <span>{editingBlog ? 'Edit Blog Article' : 'Write & Publish New Article'}</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAiDraftArticle}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Generate full article draft with AI"
                >
                  <Sparkles size={14} className="text-amber-600" />
                  <span>AI Article Generator</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setIsCreating(false); setEditingBlog(null); }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4">
              {/* Title & AI Headline Generator */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">Article Title *</label>
                  <button
                    type="button"
                    onClick={handleAiGenerateTitles}
                    className="text-[10px] text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Wand2 size={12} /> Suggest AI Catchy Title
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 10 Essential Safety Tips for Night Taxi Trips"
                  className="w-full text-sm font-extrabold p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="night-taxi-safety-tips"
                    className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Author Name</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="e.g. Editorial Desk"
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Publish Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Read Time (Calculated)</label>
                  <input
                    type="text"
                    value={estReadTime}
                    readOnly
                    className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-bold"
                  />
                </div>
              </div>

              {/* Cover Image Picker */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Article Cover Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 text-xs font-mono p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => { setPickerTarget('cover'); setShowImagePicker(true); }}
                    className="px-3 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                  >
                    <ImageIcon size={14} /> Browse Unsplash Photos
                  </button>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Short Excerpt (SEO Search Snippet) *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="A concise 1-2 sentence summary for search engines and post cards..."
                  className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Rich Markdown Editor Bar */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 bg-slate-100 p-2 rounded-xl border border-slate-200">
                  <div className="flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      onClick={() => insertFormatting('# ')}
                      className="p-1.5 bg-white hover:bg-slate-200 rounded text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      title="Heading 1"
                    >
                      <Heading1 size={14} /> H1
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('## ')}
                      className="p-1.5 bg-white hover:bg-slate-200 rounded text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      title="Heading 2"
                    >
                      <Heading2 size={14} /> H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('### ')}
                      className="p-1.5 bg-white hover:bg-slate-200 rounded text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      title="Heading 3"
                    >
                      <Heading3 size={14} /> H3
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => insertFormatting('**', '**')}
                      className="p-1.5 bg-white hover:bg-slate-200 rounded text-slate-700 font-bold cursor-pointer"
                      title="Bold"
                    >
                      <Bold size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('*', '*')}
                      className="p-1.5 bg-white hover:bg-slate-200 rounded text-slate-700 font-bold cursor-pointer"
                      title="Italic"
                    >
                      <Italic size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('> ')}
                      className="p-1.5 bg-white hover:bg-slate-200 rounded text-slate-700 font-bold cursor-pointer"
                      title="Blockquote"
                    >
                      <Quote size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('- ')}
                      className="p-1.5 bg-white hover:bg-slate-200 rounded text-slate-700 font-bold cursor-pointer"
                      title="Bullet List"
                    >
                      <List size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('```\n', '\n```')}
                      className="p-1.5 bg-white hover:bg-slate-200 rounded text-slate-700 font-bold cursor-pointer"
                      title="Code Block"
                    >
                      <Code size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n---\n')}
                      className="p-1.5 bg-white hover:bg-slate-200 rounded text-slate-700 font-bold text-xs cursor-pointer"
                      title="Divider Line"
                    >
                      --- Divider
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setPickerTarget('body'); setShowImagePicker(true); }}
                    className="p-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded flex items-center gap-1 cursor-pointer"
                  >
                    <ImageIcon size={14} /> Insert Body Image
                  </button>
                </div>

                <label className="text-xs font-bold text-slate-700 block mb-1">Full Article Body (Markdown Supported)</label>
                <textarea
                  id="blog-content-area"
                  rows={12}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write full article here... Supports Markdown headers, bold, images, bullet lists and blockquotes."
                  className="w-full text-xs font-mono p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 leading-relaxed"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mt-1">
                  <span>Words: {wordCount} | Est. Read: {estReadTime}</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Markdown Rich Format Ready
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value as any })}
                    placeholder="Safety, GPS, Night Ride"
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Publish Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                  >
                    <option value="Published">Published (Visible on Public Website)</option>
                    <option value="Draft">Draft (Internal Only)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsCreating(false); setEditingBlog(null); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>{editingBlog ? 'Update Article' : 'Publish Article Live'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Column (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-3 sticky top-6">
            <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                <span>Live Article Preview</span>
              </span>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={cn(
                    "px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer",
                    previewDevice === 'mobile' ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                  )}
                >
                  Mobile View
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={cn(
                    "px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer",
                    previewDevice === 'desktop' ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                  )}
                >
                  Desktop View
                </button>
              </div>
            </div>

            {/* Simulated Frame */}
            <div className={cn(
              "w-full mx-auto bg-slate-100 rounded-3xl p-3 shadow-md border-2 border-slate-300 overflow-hidden transition-all duration-300",
              previewDevice === 'mobile' ? "max-w-sm" : "max-w-full"
            )}>
              <div className="bg-white rounded-2xl overflow-hidden min-h-[500px] max-h-[650px] overflow-y-auto font-sans text-slate-800 border border-slate-200">
                {/* Header */}
                <div className="bg-white text-slate-900 p-3.5 flex items-center justify-between border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-amber-500" />
                    <span className="text-xs font-black tracking-wider uppercase">City Cab Blog</span>
                  </div>
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                    {formData.category || 'Article'}
                  </span>
                </div>

                {/* Hero Cover */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={formData.coverImage || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'}
                    alt="Preview cover"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800');
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3.5">
                    <span className="text-[10px] font-bold text-amber-300 bg-slate-950/80 px-2.5 py-1 rounded-md">
                      {estReadTime} • {formData.date}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3.5">
                  <h1 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {formData.title || 'Your Article Title Preview Will Appear Here'}
                  </h1>

                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 border-b border-slate-100 pb-2">
                    <span className="flex items-center gap-1.5">
                      <User size={13} className="text-amber-500" />
                      <span>By {formData.author || 'Admin Editorial Desk'}</span>
                    </span>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                      {formData.status || 'Published'}
                    </span>
                  </div>

                  {formData.excerpt && (
                    <p className="text-xs text-slate-700 font-medium leading-relaxed bg-amber-50/60 p-3 rounded-xl border border-amber-200/80">
                      {formData.excerpt}
                    </p>
                  )}

                  <div className="text-xs text-slate-700 space-y-2 leading-relaxed whitespace-pre-line pt-1 font-sans">
                    {formData.content || 'Full article text content preview goes here...'}
                  </div>

                  {formData.tags && (
                    <div className="flex flex-wrap gap-1 pt-3 border-t border-slate-100">
                      {(Array.isArray(formData.tags) ? formData.tags : [formData.tags]).map((t, idx) => (
                        <span key={idx} className="text-[9px] bg-slate-100 font-bold text-slate-600 px-2 py-0.5 rounded-md">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Blog List & Search View */
        <div className="space-y-4">
          {/* Filters & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles by title, tag or category..."
                className="w-full text-xs font-medium pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer",
                    selectedCategory === cat
                      ? "bg-amber-400 text-slate-950 shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Blog Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBlogs.map(blog => (
              <div
                key={blog.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800');
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-slate-800">
                      {blog.category}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-slate-950/70 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-md">
                      {blog.readTime || '4 min read'}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                      <span>{blog.date}</span>
                      <span>By {blog.author}</span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">
                      {blog.title}
                    </h3>

                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {blog.status}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(blog)}
                      className="p-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded-lg transition-colors cursor-pointer"
                      title="Edit Article"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <BookOpen className="mx-auto text-slate-300" size={36} />
              <p className="text-sm font-bold text-slate-600">No blog articles match your search criteria.</p>
              <button
                onClick={handleOpenCreate}
                className="px-4 py-2 bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Write New Article
              </button>
            </div>
          )}
        </div>
      )}

      {/* Unsplash Image Gallery Picker Modal */}
      {showImagePicker && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="text-amber-500" size={20} />
                <h3 className="font-extrabold text-slate-900 text-base">Select High-Res Transport Photo</h3>
              </div>
              <button
                onClick={() => setShowImagePicker(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Click any image below to use it as the {pickerTarget === 'cover' ? 'Article Cover Image' : 'Inline Body Image'}.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CURATED_UNSPLASH_IMAGES.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (pickerTarget === 'cover') {
                      setFormData(prev => ({ ...prev, coverImage: img.url }));
                    } else {
                      insertFormatting(`\n![${img.title}](${img.url})\n`);
                    }
                    setShowImagePicker(false);
                    if (setToast) setToast({ message: 'Photo applied to article!', type: 'success' });
                  }}
                  className="group relative rounded-xl overflow-hidden border border-slate-200 hover:border-amber-500 cursor-pointer shadow-2xs hover:shadow-md transition-all aspect-video"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2 opacity-90">
                    <span className="text-[9px] font-bold text-white truncate leading-tight">{img.title}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowImagePicker(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
