import React, { useState, useEffect, useMemo } from 'react';
import { api } from './services/api';
import { Category, CategoryData, CategoryId, ContentItem, TodoItem, Section } from './types';
import { Icon } from './components/Icon';
import { SearchBar } from './components/SearchBar';
import { ShortcutCard } from './components/ShortcutCard';
import { ConceptCard } from './components/ConceptCard';
import { TodoCard } from './components/TodoCard';

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [contentData, setContentData] = useState<Record<string, CategoryData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [activeCategory, setActiveCategory] = useState<CategoryId>('shortcuts');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Editor Modal States
  const [modalType, setModalType] = useState<'section' | 'item' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [targetSectionId, setTargetSectionId] = useState<string | null>(null);

  // Drag and Drop States
  const [draggedItem, setDraggedItem] = useState<{ itemId: string; fromSectionId: number } | null>(null);
  const [dragOverSectionId, setDragOverSectionId] = useState<number | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getInitialData();
      setCategories(data.categories);
      setContentData(data.content);
      if (data.categories.length > 0 && !data.categories.find(c => c.id === activeCategory)) {
        setActiveCategory(data.categories[0].id);
      }
    } catch (e) {
      console.error("App load failed", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleTodoToggle = async (id: string, newState: boolean) => {
    const newContent = { ...contentData };
    const todoCat = newContent['todo'];
    if (todoCat) {
      todoCat.sections = todoCat.sections.map(s => ({
        ...s, items: s.items.map(item => item.id === id ? { ...item, isCompleted: newState } : item)
      }));
      setContentData(newContent);
    }
    await api.toggleTodo(id, newState);
  };

  // CRUD Handlers
  const handleSaveSection = async () => {
    if (!formData.title) return;
    if (editingId) {
      await api.updateSection(editingId, formData.title);
    } else {
      await api.createSection({ category_id: activeCategory, title: formData.title, order_index: 0 });
    }
    setModalType(null);
    fetchData();
  };

  const handleSaveItem = async () => {
    if (!formData.title || !formData.type) return;
    const payload = { ...formData, section_id: targetSectionId };
    if (editingId) {
      await api.updateItem(editingId, payload);
    } else {
      await api.createItem(payload);
    }
    setModalType(null);
    fetchData();
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm("Are you sure? This will delete all items in this section.")) return;
    await api.deleteSection(id);
    fetchData();
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await api.deleteItem(id);
    fetchData();
  };

  const openItemEditor = (sectionId: string, item?: ContentItem) => {
    setTargetSectionId(sectionId);
    setModalType('item');
    if (item) {
      setEditingId(item.id);
      setFormData(item);
    } else {
      setEditingId(null);
      setFormData({ type: 'shortcut', title: '', description: '', tags: [], keys: [], context: 'General', inputs: [], outputs: [], details: [], category: 'Shader' });
    }
  };

  const openSectionEditor = (section?: Section) => {
    setModalType('section');
    if (section) {
      setEditingId(section.id);
      setFormData({ title: section.title });
    } else {
      setEditingId(null);
      setFormData({ title: '' });
    }
  };

  const filteredData = useMemo(() => {
    if (isLoading) return null;
    if (!searchTerm.trim()) {
      const activeData = contentData[activeCategory];
      return { title: categories.find(c => c.id === activeCategory)?.label || 'Content', sections: activeData?.sections || [], isSearchResult: false };
    }
    const term = searchTerm.toLowerCase();
    const allSections: any[] = [];
    Object.keys(contentData).forEach(catId => {
      const catData = contentData[catId];
      const matching: any[] = [];
      catData.sections.forEach(s => {
        s.items.forEach(i => {
          if (i.title.toLowerCase().includes(term) || i.description.toLowerCase().includes(term)) matching.push(i);
        });
      });
      if (matching.length) allSections.push({ title: categories.find(c => c.id === catId)?.label || catId, items: matching });
    });
    return { title: `Search: "${searchTerm}"`, sections: allSections, isSearchResult: true };
  }, [activeCategory, searchTerm, contentData, categories, isLoading]);

  const handleDragStart = (itemId: string, sectionId: number) => {
    if (!isAdmin) return;
    setDraggedItem({ itemId, fromSectionId: sectionId });
  };

  const handleDragOver = (e: React.DragEvent, sectionId: number) => {
    if (!isAdmin) return;
    e.preventDefault();
    setDragOverSectionId(sectionId);
  };

  const handleDragLeave = () => {
    setDragOverSectionId(null);
  };

  const handleDrop = async (e: React.DragEvent, toSectionId: number) => {
    if (!isAdmin || !draggedItem) return;
    e.preventDefault();
    setDragOverSectionId(null);

    const { itemId, fromSectionId } = draggedItem;
    
    // Find the item to update
    let itemToMove: ContentItem | null = null;
    const newContent = JSON.parse(JSON.stringify(contentData));

    // Find and remove item from source section
    for (const catId of Object.keys(newContent)) {
      const catData = newContent[catId];
      for (const section of catData.sections) {
        const itemIndex = section.items.findIndex((i: any) => i.id === itemId);
        if (itemIndex !== -1) {
          itemToMove = section.items[itemIndex];
          section.items.splice(itemIndex, 1);
          break;
        }
      }
      if (itemToMove) break;
    }

    if (!itemToMove) return;

    // Add to target section and update order_index
    for (const catId of Object.keys(newContent)) {
      const catData = newContent[catId];
      for (const section of catData.sections) {
        if (section.id === toSectionId) {
          itemToMove.section_id = toSectionId.toString();
          itemToMove.order_index = section.items.length + 1;
          section.items.push(itemToMove);
          break;
        }
      }
    }

    setContentData(newContent);
    setDraggedItem(null);

    // Update in backend
    await api.updateItem(itemId, { ...itemToMove, section_id: toSectionId, order_index: itemToMove.order_index });
  };

  return (
    <div className="flex min-h-screen font-sans selection:bg-blender-orange/30">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 glass-panel z-30 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 mt-2">
            <h1 className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-100">Blender<span className="text-blender-orange font-light">Handbook</span></h1>
          </div>
          <nav className="space-y-1 flex-1 overflow-y-auto">
            {isLoading ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="w-full h-10 mb-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />) :
              categories.map(cat => (
                <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setSearchTerm(''); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeCategory === cat.id && !searchTerm ? 'bg-blender-orange/10 text-blender-orange font-semibold border border-blender-orange/20' : 'text-zinc-600 dark:text-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-800/50'}`}>
                  <Icon name={cat.icon} className={activeCategory === cat.id && !searchTerm ? 'text-blender-orange' : 'text-zinc-400'} /> {cat.label}
                </button>
              ))
            }
          </nav>
          <div className="pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] uppercase font-bold text-zinc-500">Edit Mode</span>
              <button onClick={() => setIsAdmin(!isAdmin)} className={`p-1.5 rounded-lg transition-colors ${isAdmin ? 'bg-blender-orange/10 text-blender-orange' : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                <Icon name={isAdmin ? 'ExternalLink' : 'Settings'} size={14} />
              </button>
            </div>
            <div className="bg-white/40 dark:bg-zinc-800/40 rounded-xl p-4 border border-white/20 dark:border-zinc-700/30">
              <div className="flex bg-zinc-200/50 dark:bg-zinc-900/50 rounded-lg p-1">
                <button onClick={() => setIsDarkMode(false)} className={`flex-1 py-1.5 rounded-md text-xs font-medium ${!isDarkMode ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500'}`}><Icon name="Sun" size={12} className="inline mr-1"/> Light</button>
                <button onClick={() => setIsDarkMode(true)} className={`flex-1 py-1.5 rounded-md text-xs font-medium ${isDarkMode ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500'}`}><Icon name="Moon" size={12} className="inline mr-1"/> Dark</button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 w-full min-w-0 flex flex-col h-screen overflow-y-auto scroll-smooth">
        <header className="sticky top-0 z-10 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 px-6 py-4 flex items-center justify-between gap-4">
           <div className="flex items-center gap-4 lg:hidden">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-zinc-500 rounded-lg"><Icon name="Menu" /></button>
           </div>
           <div className="text-base lg:text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-3 whitespace-nowrap">
              <span className="text-zinc-500">Reference</span> <Icon name="ChevronRight" size={16} /> <span className={filteredData?.isSearchResult ? 'text-blender-orange' : ''}>{filteredData?.title || 'Loading...'}</span>
           </div>
           <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </header>

        <div className="flex-1 p-6 lg:p-12 max-w-6xl mx-auto w-full">
            <div className="mb-8 animate-fade-in-up">
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-2 text-zinc-900 dark:text-white">{filteredData?.title}</h1>
              {!filteredData?.isSearchResult && <p className="text-lg text-zinc-500 dark:text-zinc-400">{categories.find(c => c.id === activeCategory)?.description}</p>}
            </div>

            {isLoading ? <div className="space-y-12"> <div className="h-48 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl animate-pulse" /> </div> :
              <div className="space-y-12 pb-20">
                {filteredData?.sections.map((sec: any, idx: number) => (
                  <section key={sec.id || idx} className="group/section">
                    <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mb-6 flex items-center gap-2 pb-2 border-b border-zinc-200/50 dark:border-zinc-800/50">
                      {sec.title}
                      {isAdmin && (
                        <div className="flex gap-2 ml-4">
                          <button onClick={() => openSectionEditor(sec)} className="p-1 text-zinc-400 hover:text-blender-orange"><Icon name="Settings" size={14} /></button>
                          <button onClick={() => handleDeleteSection(sec.id)} className="p-1 text-zinc-400 hover:text-red-500"><Icon name="X" size={14} /></button>
                        </div>
                      )}
                      <span className="text-xs font-normal text-zinc-500 ml-auto bg-white/50 dark:bg-zinc-900/50 border px-2.5 py-1 rounded-full">{sec.items.length} items</span>
                    </h2>
                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-4 rounded-xl transition-colors ${
                      isAdmin && dragOverSectionId === sec.id ? 'bg-blender-orange/10 border-2 border-blender-orange' : ''
                    }`}
                    onDragOver={(e) => handleDragOver(e, sec.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, sec.id)}>
                      {sec.items.map((item: any) => (
                        <div
                          key={item.id}
                          draggable={isAdmin}
                          onDragStart={() => handleDragStart(item.id, sec.id)}
                          className={isAdmin ? 'cursor-move' : ''}
                        >
                          {item.type === 'shortcut' ? <ShortcutCard item={item} isAdmin={isAdmin} onEdit={(i) => openItemEditor(sec.id, i)} onDelete={handleDeleteItem} /> :
                           item.type === 'todo' ? <TodoCard item={item} isAdmin={isAdmin} onToggle={handleTodoToggle} onEdit={(i) => openItemEditor(sec.id, i)} onDelete={handleDeleteItem} /> :
                           <ConceptCard item={item} isAdmin={isAdmin} onEdit={(i) => openItemEditor(sec.id, i)} onDelete={handleDeleteItem} />}
                        </div>
                      ))}
                      {isAdmin && (
                        <button onClick={() => openItemEditor(sec.id)} className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400 hover:border-blender-orange hover:text-blender-orange transition-all">
                          <Icon name="ExternalLink" size={24} className="mr-2" /> Add Item
                        </button>
                      )}
                    </div>
                  </section>
                ))}
                {isAdmin && !filteredData?.isSearchResult && (
                  <button onClick={() => openSectionEditor()} className="w-full py-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400 hover:border-blender-orange hover:text-blender-orange transition-all flex flex-col items-center gap-2">
                    <Icon name="Grid" size={32} /> <span className="font-bold">Add New Section</span>
                  </button>
                )}
              </div>
            }
        </div>
      </main>

      {/* Editor Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 w-full max-w-xl shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit' : 'Add'} {modalType === 'section' ? 'Section' : 'Item'}</h2>
            <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
              <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" />
              {modalType === 'item' && (
                <>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700">
                    <option value="shortcut">Shortcut</option>
                    <option value="concept">Concept/Asset</option>
                    <option value="node">Node</option>
                    <option value="todo">Tutorial/Todo</option>
                  </select>
                  <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700 h-24" />
                  
                  {formData.type === 'shortcut' && (
                    <>
                      <input type="text" placeholder="Keys (comma separated)" value={formData.keys?.join(',')} onChange={e => setFormData({ ...formData, keys: e.target.value.split(',').filter(x => x) })} className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" />
                      <select value={formData.context} onChange={e => setFormData({ ...formData, context: e.target.value })} className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700">
                        <option value="General">General</option><option value="Object Mode">Object Mode</option><option value="Edit Mode">Edit Mode</option><option value="Node Editor">Node Editor</option>
                      </select>
                    </>
                  )}

                  {formData.type === 'concept' && (
                    <>
                      <input type="text" placeholder="Image URL" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" />
                      <input type="text" placeholder="Github URL" value={formData.githubUrl} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" />
                    </>
                  )}

                  {formData.type === 'node' && (
                    <>
                      <input type="text" placeholder="Inputs (comma separated)" value={formData.inputs?.join(',')} onChange={e => setFormData({ ...formData, inputs: e.target.value.split(',').filter(x => x) })} className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" />
                      <input type="text" placeholder="Outputs (comma separated)" value={formData.outputs?.join(',')} onChange={e => setFormData({ ...formData, outputs: e.target.value.split(',').filter(x => x) })} className="w-full p-3 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700" />
                    </>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setModalType(null)} className="flex-1 py-3 px-6 rounded-xl font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">Cancel</button>
              <button onClick={modalType === 'section' ? handleSaveSection : handleSaveItem} className="flex-1 py-3 px-6 rounded-xl font-bold bg-blender-orange text-white shadow-lg">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;