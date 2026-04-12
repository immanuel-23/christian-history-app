import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('churches');
  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false); // For mobile sidebar
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
  const [formData, setFormData] = useState({ 
    name: '', title: '', eventName: '', verseText: '', reference: '',
    location: '', yearEstablished: '', yearWritten: '', 
    description: '', biography: '', theologyFocus: '', significance: '', lyrics: '',
    work: '', lifeHistory: '', servicePeriod: '',
    imageUrl: '', audioUrl: '', author: '', dateOfBirth: '', dateOfDeath: '', eventDate: ''
  });
  
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
    setIsEditing(false);
    resetForm();
    setShowSidebar(false); // Close sidebar on tab change (mobile)
  }, [activeTab]);

  const resetForm = () => {
    setFormData({ 
      name: '', title: '', eventName: '', verseText: '', reference: '',
      location: '', yearEstablished: '', yearWritten: '', 
      description: '', biography: '', theologyFocus: '', significance: '', lyrics: '',
      work: '', lifeHistory: '', servicePeriod: '',
      imageUrl: '', audioUrl: '', author: '', dateOfBirth: '', dateOfDeath: '', eventDate: ''
    });
    setIsEditing(false);
    setEditId(null);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiBase}/${activeTab}`);
      setItems(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
    // Reset file input so same file can be selected again
    e.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${apiBase}/${activeTab}/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${apiBase}/${activeTab}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchData();
      resetForm();
    } catch (err) {
      alert("Error saving item");
    }
  };

  const startEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setFormData({ ...item });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this item?")) return;
    try {
      await axios.delete(`${apiBase}/${activeTab}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert("Error deleting item");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen aura-page-bg flex flex-col md:flex-row font-sans overflow-x-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden aura-header px-6 py-4 flex items-center justify-between border-b dark:border-white/5 sticky top-0 z-[60]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white uppercase">{localStorage.getItem('adminUser')?.charAt(0) || 'A'}</div>
          <span className="font-black tracking-tighter truncate max-w-[150px]">{localStorage.getItem('adminUser') || 'Admin'}</span>
        </div>
        <button 
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 bg-slate-100 dark:bg-white/5 rounded-lg text-xl"
        >
          {showSidebar ? '✕' : '☰'}
        </button>
      </div>

      {/* Glass Sidebar */}
      <AnimatePresence>
        {(showSidebar || window.innerWidth >= 768) && (
          <motion.div 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className={`fixed md:sticky top-0 left-0 bottom-0 w-72 aura-header border-r border-slate-200 dark:border-white/10 px-6 py-10 flex flex-col z-50 transition-all ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
          >
            <div className="hidden md:flex items-center space-x-3 mb-10 px-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl shadow-lg flex items-center justify-center font-bold text-white text-xl uppercase">
                {localStorage.getItem('adminUser')?.charAt(0) || 'A'}
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-black tracking-tighter leading-tight truncate max-w-[180px]">
                  {localStorage.getItem('adminUser') || 'Admin'}
                </h2>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest opacity-70">Administrator</span>
              </div>
            </div>

            <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
              {[
                { id: 'churches', label: 'Churches', icon: '⛪' },
                { id: 'preachers', label: 'Preachers', icon: '👤' },
                { id: 'missionaries', label: 'Missionaries', icon: '🌍' },
                { id: 'hymns', label: 'Hymns', icon: '🎶' },
                { id: 'events', label: 'Moments', icon: '📜' },
                { id: 'bible-verses', label: 'Daily Verse', icon: '📖' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm flex items-center space-x-3 group ${
                    activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="text-xl group-hover:scale-125 transition-transform">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Bottom Controls */}
            <div className="pt-6 mt-6 border-t dark:border-white/5 space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{darkMode ? 'Night Mode' : 'Day Mode'}</span>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 hover:scale-110 transition-transform shadow-inner"
                >
                  {darkMode ? '🌙' : '☀️'}
                </button>
              </div>

              <button 
                onClick={handleLogout} 
                className="bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-md flex items-center justify-center space-x-2"
              >
                <span>Logout</span>
                <span>🚪</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-12 relative h-screen custom-scrollbar">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Main List Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-7 space-y-8 order-2 xl:order-1"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight capitalize mb-1">Manage {activeTab.replace('-', ' ')}</h1>
                <p className="text-slate-500 text-sm font-medium">Control and archive the historical data.</p>
              </div>
              <a 
                href="/" 
                target="_blank" 
                className="aura-btn-primary py-3 flex items-center justify-center space-x-2 shadow-blue-500/20"
              >
                <span>View Site</span>
                <span className="text-lg">↗</span>
              </a>
            </div>
            
            <div className="aura-card p-0 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                      <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Database Entry</th>
                      <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    <AnimatePresence mode="popLayout">
                      {items.length === 0 ? (
                        <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <td colSpan="2" className="p-20 text-center">
                            <div className="text-4xl mb-4">🔍</div>
                            <p className="text-slate-400 font-medium italic">No entries found.</p>
                          </td>
                        </motion.tr>
                      ) : (
                        items.map((item, index) => (
                          <motion.tr 
                            key={item.id} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                          >
                            <td className="p-6">
                              <div className="flex items-center space-x-4">
                                <span className="text-slate-300 dark:text-slate-600 font-mono text-[10px]">{item.id}</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{item.name || item.title || item.eventName || item.reference}</span>
                              </div>
                            </td>
                            <td className="p-6 text-right space-x-2 whitespace-nowrap">
                              <button onClick={() => startEdit(item)} className="text-blue-500 hover:text-white bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-600 font-black py-2 px-4 rounded-xl text-[10px] uppercase tracking-widest transition-all">Edit</button>
                              <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-white bg-red-50 dark:bg-red-900/20 hover:bg-red-500 font-black py-2 px-4 rounded-xl text-[10px] uppercase tracking-widest transition-all">Del</button>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Side Form Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="xl:col-span-5 order-1 xl:order-2"
          >
            <div className="aura-card p-6 md:p-10 sticky top-10 shadow-2xl border-blue-500/10 dark:border-blue-500/20">
              <div className="mb-8 text-center">
                <span className="aura-badge mb-4 inline-block">{isEditing ? 'Editor Mode' : 'New Entry'}</span>
                <h2 className="text-2xl md:text-3xl font-black capitalize">{isEditing ? 'Edit' : 'Create'} {activeTab.replace('-', ' ')}</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {activeTab === 'churches' && (
                      <>
                        <input type="text" placeholder="Church Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="aura-admin-input h-12 md:h-14 text-base md:text-lg" required />
                        <input type="text" placeholder="📍 Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="aura-admin-input h-12" />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="📅 Year Est." value={formData.yearEstablished} onChange={e => setFormData({...formData, yearEstablished: e.target.value})} className="aura-admin-input" />
                          <input type="text" placeholder="⛪ Denomination" value={formData.denomination} onChange={e => setFormData({...formData, denomination: e.target.value})} className="aura-admin-input" />
                        </div>
                        <textarea placeholder="Tell the church story..." rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="aura-admin-input py-4"></textarea>
                      </>
                    )}

                    {activeTab === 'preachers' && (
                      <>
                        <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="aura-admin-input h-12 md:h-14 text-base md:text-lg" required />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <AuraDatePicker 
                            label="Date of Birth" 
                            value={formData.dateOfBirth} 
                            onChange={val => setFormData({...formData, dateOfBirth: val})} 
                          />
                          <AuraDatePicker 
                            label="Date of Death" 
                            value={formData.dateOfDeath} 
                            onChange={val => setFormData({...formData, dateOfDeath: val})} 
                          />
                        </div>
                        <input type="text" placeholder="Theology / Focus Area" value={formData.theologyFocus} onChange={e => setFormData({...formData, theologyFocus: e.target.value})} className="aura-admin-input" />
                        <textarea placeholder="Write their legacy..." rows="4" value={formData.biography} onChange={e => setFormData({...formData, biography: e.target.value})} className="aura-admin-input py-4"></textarea>
                      </>
                    )}

                    {activeTab === 'missionaries' && (
                      <>
                        <input type="text" placeholder="Missionary Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="aura-admin-input h-12 md:h-14 text-base md:text-lg" required />
                        <input type="text" placeholder="🌍 Field of Work (e.g. India, Africa)" value={formData.work} onChange={e => setFormData({...formData, work: e.target.value})} className="aura-admin-input h-12" />
                        <input type="text" placeholder="📅 Service Period (e.g. 1850-1880)" value={formData.servicePeriod} onChange={e => setFormData({...formData, servicePeriod: e.target.value})} className="aura-admin-input" />
                        <textarea placeholder="Their life history and impact..." rows="6" value={formData.lifeHistory} onChange={e => setFormData({...formData, lifeHistory: e.target.value})} className="aura-admin-input py-4"></textarea>
                      </>
                    )}

                    {activeTab === 'hymns' && (
                      <>
                        <input type="text" placeholder="Hymn Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="aura-admin-input h-12 md:h-14 text-base md:text-lg" required />
                        <input type="text" placeholder="✍️ Original Author" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="aura-admin-input" />
                        <div className="grid grid-cols-2 gap-4">
                          <input type="number" placeholder="Year Written" value={formData.yearWritten} onChange={e => setFormData({...formData, yearWritten: e.target.value})} className="aura-admin-input" />
                          <input type="text" placeholder="Audio URL" value={formData.audioUrl} onChange={e => setFormData({...formData, audioUrl: e.target.value})} className="aura-admin-input" />
                        </div>
                        <textarea placeholder="Hymn Lyrics..." rows="6" value={formData.lyrics} onChange={e => setFormData({...formData, lyrics: e.target.value})} className="aura-admin-input py-4"></textarea>
                      </>
                    )}

                    {activeTab === 'events' && (
                      <>
                        <input type="text" placeholder="Historical Moment" value={formData.eventName} onChange={e => setFormData({...formData, eventName: e.target.value})} className="aura-admin-input h-12 md:h-14 text-base md:text-lg" required />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <AuraDatePicker 
                            label="Event Date" 
                            value={formData.eventDate} 
                            onChange={val => setFormData({...formData, eventDate: val})} 
                          />
                          <input type="text" placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="aura-admin-input mt-auto" />
                        </div>
                        <input type="text" placeholder="Significance / Impact" value={formData.significance} onChange={e => setFormData({...formData, significance: e.target.value})} className="aura-admin-input" />
                        <textarea placeholder="Describe the moment..." rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="aura-admin-input py-4"></textarea>
                      </>
                    )}

                    {activeTab === 'bible-verses' && (
                      <>
                        <textarea placeholder="Welcome Message / Bible Verse" rows="6" value={formData.verseText} onChange={e => setFormData({...formData, verseText: e.target.value})} className="aura-admin-input py-6 text-lg italic text-center" required></textarea>
                        <input type="text" placeholder="Reference (e.g. John 3:16)" value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} className="aura-admin-input text-center font-black" required />
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Media Upload */}
                {activeTab !== 'bible-verses' && (
                  <div className="pt-6 border-t dark:border-white/5">
                    <div className="flex flex-col space-y-3">
                      <div className="relative group">
                        <input type="text" placeholder="External Image URL" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="aura-admin-input pr-12 text-xs" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40">🔗</span>
                      </div>
                      <div className="p-4 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl text-center hover:border-blue-500 transition-colors cursor-pointer relative group">
                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-600">Upload Photo</p>
                      </div>
                    </div>
                    {formData.imageUrl && (
                      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="mt-4 h-24 w-full rounded-2xl overflow-hidden border-2 border-white dark:border-white/5 shadow-lg">
                        <img src={formData.imageUrl} className="w-full h-full object-cover" alt="Preview"/>
                      </motion.div>
                    )}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  {isEditing && (
                    <button type="button" onClick={resetForm} className="flex-1 bg-slate-100 dark:bg-white/5 text-slate-500 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest transition-all hover:bg-slate-200">Cancel</button>
                  )}
                  <button type="submit" className="aura-btn-primary flex-[2] py-4 h-12 md:h-14">
                    {isEditing ? 'Sync Changes' : 'Publish Entry'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// PREMIUM CUSTOM DATE PICKER COMPONENT
const AuraDatePicker = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse initial value or default to today
  const [tempDate, setTempDate] = useState(() => {
    if (value) {
      const parts = value.split('-');
      return { year: parts[0], month: parts[1], day: parts[2] };
    }
    const d = new Date();
    return { 
      year: String(d.getFullYear()), 
      month: String(d.getMonth() + 1).padStart(2, '0'), 
      day: String(d.getDate()).padStart(2, '0') 
    };
  });

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const handleApply = () => {
    const formatted = `${tempDate.year}-${tempDate.month}-${tempDate.day}`;
    onChange(formatted);
    setIsOpen(false);
  };

  return (
    <div className="block space-y-1 group relative">
      <span className="text-[10px] font-black text-slate-400 px-2 uppercase tracking-widest group-focus-within:text-blue-600 transition-colors italic">
        {label}
      </span>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="aura-admin-input h-12 flex items-center justify-between cursor-pointer group hover:border-blue-500/50 transition-all active:scale-95"
      >
        <span className={value ? "text-slate-800 dark:text-slate-200 font-bold" : "text-slate-400 italic"}>
          {value ? `${tempDate.day} ${months[parseInt(tempDate.month)-1]} ${tempDate.year}` : "Select Date"}
        </span>
        <span className="text-blue-500 group-hover:scale-110 transition-transform">📅</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 z-[101] aura-card p-4 shadow-2xl border border-blue-500/20 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90"
            >
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-[8px] font-black uppercase text-slate-400 text-center">Year</span>
                  <input 
                    type="number" 
                    value={tempDate.year} 
                    onChange={e => setTempDate({...tempDate, year: e.target.value})}
                    className="bg-slate-100 dark:bg-white/5 border-none rounded-xl p-2 text-center font-bold text-sm"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-[8px] font-black uppercase text-slate-400 text-center">Month</span>
                  <select 
                    value={tempDate.month} 
                    onChange={e => setTempDate({...tempDate, month: e.target.value})}
                    className="bg-slate-100 dark:bg-white/5 border-none rounded-xl p-2 text-center font-bold text-sm appearance-none"
                  >
                    {months.map((m, i) => (
                      <option key={m} value={String(i + 1).padStart(2, '0')}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-[8px] font-black uppercase text-slate-400 text-center">Day</span>
                  <input 
                    type="number" 
                    min="1" max="31"
                    value={tempDate.day} 
                    onChange={e => setTempDate({...tempDate, day: e.target.value.padStart(2, '0')})}
                    className="bg-slate-100 dark:bg-white/5 border-none rounded-xl p-2 text-center font-bold text-sm"
                  />
                </div>
              </div>
              <button 
                type="button"
                onClick={handleApply}
                className="w-full bg-blue-600 text-white rounded-xl py-2 text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
              >
                Apply Date
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
