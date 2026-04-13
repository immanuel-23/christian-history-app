import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home({ darkMode, setDarkMode }) {
  const [churches, setChurches] = useState([]);
  const [preachers, setPreachers] = useState([]);
  const [hymns, setHymns] = useState([]);
  const [events, setEvents] = useState([]);
  const [missionaries, setMissionaries] = useState([]);
  const [allVerses, setAllVerses] = useState([]);
  const [loading, setLoading] = useState(true); // Global loading state

  const [activeTab, setActiveTab] = useState('churches');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);


  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

    // Fetch all data in parallel and mark loading done when all finish
    Promise.all([
      axios.get(`${apiBase}/churches`).then(res => setChurches(res.data)),
      axios.get(`${apiBase}/preachers`).then(res => setPreachers(res.data)),
      axios.get(`${apiBase}/hymns`).then(res => setHymns(res.data)),
      axios.get(`${apiBase}/events`).then(res => setEvents(res.data)),
      axios.get(`${apiBase}/missionaries`).then(res => setMissionaries(res.data)),
      axios.get(`${apiBase}/bible-verses`).then(res => setAllVerses(res.data)),
    ])
      .catch(console.error)
      .finally(() => setLoading(false)); // Hide loader when done (or on error)

    // Visit Tracking Logic
    const hasVisited = sessionStorage.getItem('visited');
    if (!hasVisited) {
      axios.post(`${apiBase}/stats/increment`)
        .then(() => sessionStorage.setItem('visited', 'true'))
        .catch(console.error);
    }
  }, []);

  const filterItems = (list, fields) => {
    return list.filter(item =>
      fields.some(field =>
        item[field]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const tabs = [
    { id: 'churches', name: 'Churches', icon: '⛪' },
    { id: 'preachers', name: 'Preachers', icon: '👤' },
    { id: 'missionaries', name: 'Missionaries', icon: '🌍' },
    { id: 'hymns', name: 'Hymns', icon: '🎶' },
    { id: 'events', name: 'Moments', icon: '📜' },
  ];

  // Pick the verse for the active tab, falling back to 'general' if no tab-specific verse exists
  const verse = allVerses.find(v => v.category === activeTab)
    || allVerses.find(v => v.category === 'general')
    || (allVerses.length > 0 ? allVerses[allVerses.length - 1] : null);

  return (
    <div className="min-h-screen">

      {/* Navigation Header */}
      <header className="aura-header px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg shadow-lg rotate-12 flex items-center justify-center font-bold text-white">C</div>
            <h1 className="text-xl font-black tracking-tight hidden md:block">History Archive</h1>
          </div>

          {/* Main Search */}
          <div className="flex-1 max-w-md mx-6">
            <div className="relative group">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="aura-search-input"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Switch to Day Mode" : "Switch to Night Mode"}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 hover:scale-110 transition-transform shadow-inner"
            >
              {darkMode ? '🌙' : '☀️'}
            </button>
            <a href="/login" className="aura-btn-primary">Admin</a>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto mt-4 flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
              className={`aura-tab-pill ${activeTab === tab.id ? 'aura-tab-pill-active' : ''}`}
            >
              <span className="mr-2">{tab.icon}</span> {tab.name}
            </button>
          ))}
        </div>
      </header>


      {/* Hero Content */}
      <AnimatePresence mode="wait">
        {searchQuery === '' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="px-6 py-12 text-center max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">Christian <span className="text-blue-600">History Archive</span></h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8">
              Explore the rich heritage of churches, preachers, hymns, and moments that shaped the faith.
            </p>

            {verse && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 border-l-4 border-blue-600 dark:border-blue-500 pl-6 text-left">
                <p className="text-2xl font-serif italic text-slate-600 dark:text-slate-400 mb-2">"{verse.verseText}"</p>
                <p className="font-bold text-blue-600 dark:text-blue-400">— {verse.reference}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 py-8 min-h-[400px] flex items-center justify-center">
        {/* Premium Loader shown only in the data area */}
        {loading ? (
          <motion.div
            key="inline-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            {/* Pulsing Cross / Logo */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0px 20px 40px rgba(37, 99, 235, 0.4)", 
                  "0px 25px 50px rgba(37, 99, 235, 0.6)", 
                  "0px 20px 40px rgba(37, 99, 235, 0.4)"
                ]
              }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-8"
            >
              <span className="text-white text-3xl font-black">✝</span>
            </motion.div>

            {/* Pulsing dots */}
            <div className="flex space-x-2 mb-6">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-blue-600"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                />
              ))}
            </div>

            <p className="text-slate-400 text-sm font-semibold tracking-widest uppercase">Loading Archive...</p>
            <p className="text-slate-300 dark:text-slate-600 text-xs mt-2 text-center">Connecting to server, please wait</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {/* Churches View */}
            {activeTab === 'churches' && (
              <motion.div key="churches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filterItems(churches, ['name', 'location', 'denomination', 'description']).map(church => (
                  <Card key={church.id} item={church} type="church" onClick={() => setSelectedItem({ ...church, type: 'church' })} />
                ))}
              </motion.div>
            )}

            {/* Preachers View */}
            {activeTab === 'preachers' && (
              <motion.div key="preachers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filterItems(preachers, ['name', 'biography', 'theologyFocus']).map(preacher => (
                  <PreacherCard key={preacher.id} preacher={preacher} onClick={() => setSelectedItem({ ...preacher, type: 'preacher' })} />
                ))}
              </motion.div>
            )}

            {/* Hymns View — Premium Music Library Style */}
            {activeTab === 'hymns' && (
              <motion.div key="hymns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4 px-3">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">🎶 Hymn Collection</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{filterItems(hymns, ['title', 'author', 'lyrics']).length} hymns</p>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span className="hidden md:block w-[140px] text-right">Author</span>
                    <span className="hidden lg:block w-16 text-right ml-3">Year</span>
                  </div>
                </div>
                {/* Subtle divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent mb-2" />
                {/* Hymn Rows */}
                {filterItems(hymns, ['title', 'author', 'lyrics']).map((hymn, index) => (
                  <HymnRow key={hymn.id} hymn={hymn} index={index + 1} onClick={() => setSelectedItem({ ...hymn, type: 'hymn' })} />
                ))}
              </motion.div>
            )}

            {/* Events View */}
            {activeTab === 'events' && (
              <motion.div key="events" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 max-w-4xl mx-auto">
                {filterItems(events, ['eventName', 'description', 'significance']).map(event => (
                  <EventRow key={event.id} event={event} onClick={() => setSelectedItem({ ...event, type: 'event' })} />
                ))}
              </motion.div>
            )}

            {/* Missionaries View */}
            {activeTab === 'missionaries' && (
              <motion.div key="missionaries" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filterItems(missionaries, ['name', 'work', 'lifeHistory']).map(missionary => (
                  <Card key={missionary.id} item={missionary} type="missionary" onClick={() => setSelectedItem({ ...missionary, type: 'missionary' })} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Detail Modal */}
      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}

const Card = ({ item, type, onClick }) => (
  <motion.div
    whileHover={{ y: -5 }}
    onClick={onClick}
    className="aura-card group"
  >
    <div className="relative h-56 overflow-hidden">
      {item.imageUrl ? (
        <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name || item.title} />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 opacity-40 text-4xl">⛪</div>
      )}
      <div className="absolute top-4 left-4 aura-badge">
        {type}
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold mb-1 truncate">{item.name || item.title}</h3>
      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-3">
        {item.location || item.author || item.work} {item.yearEstablished && `• ${item.yearEstablished}`} {item.servicePeriod && `• ${item.servicePeriod}`}
      </p>
      <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
        {item.description || item.lyrics || item.lifeHistory}
      </p>
    </div>
  </motion.div>
);

// Premium Spotify-style hymn row — compact but visually rich
const HymnRow = ({ hymn, index, onClick }) => (
  <motion.div
    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.07)', x: 2 }}
    onClick={onClick}
    className="flex items-center px-3 py-2.5 rounded-xl cursor-pointer group transition-all duration-200"
  >
    {/* Index / Play Icon */}
    <div className="w-8 flex items-center justify-center shrink-0">
      <span className="text-xs font-bold text-slate-400 dark:text-slate-600 group-hover:hidden">{index}</span>
      <span className="hidden group-hover:block text-blue-500 text-base">▶</span>
    </div>

    {/* Album Art Style Icon with gradient */}
    <div className="w-11 h-11 ml-2 rounded-xl shrink-0 overflow-hidden relative">
      <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-blue-600 to-violet-600 flex items-center justify-center shadow-lg">
        <span className="text-white text-lg">♪</span>
      </div>
      {/* Gloss overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/10 rounded-xl" />
    </div>

    {/* Title & Lyrics Preview */}
    <div className="flex-1 ml-3 min-w-0">
      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {hymn.title}
      </h3>
      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
        {hymn.lyrics?.substring(0, 55) || 'No lyrics preview'}...
      </p>
    </div>

    {/* Author Chip */}
    {hymn.author && (
      <span className="hidden md:flex items-center ml-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full shrink-0 max-w-[140px] truncate">
        ✍️ {hymn.author}
      </span>
    )}

    {/* Year Badge */}
    {hymn.yearWritten && (
      <span className="hidden lg:block ml-3 text-[11px] font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-1 rounded-full shrink-0">
        {hymn.yearWritten}
      </span>
    )}

    {/* Arrow on hover */}
    <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-3 text-blue-500">›</div>
  </motion.div>
);

const PreacherCard = ({ preacher, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    onClick={onClick}
    className="text-center group cursor-pointer"
  >
    <div className="aura-preacher-avatar-wrapper group-hover:border-solid">
      {preacher.imageUrl ? (
        <img src={preacher.imageUrl} className="w-full h-full object-cover rounded-full" alt={preacher.name} />
      ) : (
        <div className="w-full h-full bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-2xl">👤</div>
      )}
    </div>
    <h3 className="font-bold text-lg">{preacher.name}</h3>
    <p className="text-xs text-slate-500">{preacher.dateOfBirth} - {preacher.dateOfDeath}</p>
  </motion.div>
);

const EventRow = ({ event, onClick }) => (
  <motion.div
    whileHover={{ x: 10 }}
    onClick={onClick}
    className="aura-event-row group"
  >
    <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0">
      {event.imageUrl ? <img src={event.imageUrl} className="w-full h-full object-cover" /> : null}
    </div>
    <div className="flex-1">
      <div className="flex items-center space-x-3 mb-1">
        <span className="text-[10px] font-black text-blue-600 uppercase italic tracking-tighter">{event.eventDate}</span>
        <h3 className="font-bold text-lg">{event.eventName}</h3>
      </div>
      <p className="text-sm text-slate-500 line-clamp-1">{event.description}</p>
    </div>
    <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-4 text-blue-600">→</div>
  </motion.div>
);

const DetailModal = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="aura-modal-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
        className="aura-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-5/12 relative aspect-square md:aspect-auto">
          {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-slate-900 text-6xl">⛪</div>}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
        </div>
        <div className="flex-1 p-8 md:p-16 overflow-y-auto">
          <div className="flex justify-between items-start mb-8">
            <span className="aura-badge tracking-[0.3em]">{item.type}</span>
            <button onClick={onClose} className="text-slate-400 hover:text-red-500 text-4xl leading-none">&times;</button>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-none">{item.name || item.title || item.eventName}</h2>

          <div className="flex flex-wrap gap-4 mb-8 text-sm font-bold text-slate-500">
            {item.location && <span className="bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full">📍 {item.location}</span>}
            {item.author && <span className="bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full">✍️ {item.author}</span>}
            {item.eventDate && <span className="bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full">📅 {item.eventDate}</span>}
            {item.servicePeriod && <span className="bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full">📅 {item.servicePeriod}</span>}
            {item.work && <span className="bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full">🌍 {item.work}</span>}
          </div>

          <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed space-y-4 text-lg">
            <p className="whitespace-pre-line">{item.description || item.biography || item.lyrics || item.lifeHistory}</p>
            {item.theologyFocus && <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-300 italic">“{item.theologyFocus}”</div>}
            {item.significance && <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-300 font-medium">Historical Significance: {item.significance}</div>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


