import { Category, CategoryData, Section, ContentItem } from '../types';

const API_BASE_URL = 'http://localhost:3001';

export interface InitialData {
  categories: Category[];
  content: Record<string, CategoryData>;
}

export const api = {
  getInitialData: async (): Promise<InitialData> => {
    try {
      const [categoriesRes, sectionsRes, itemsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/categories`),
        fetch(`${API_BASE_URL}/api/sections`),
        fetch(`${API_BASE_URL}/api/items`)
      ]);

      if (!categoriesRes.ok || !sectionsRes.ok || !itemsRes.ok) throw new Error('Failed to fetch data');

      const categories: Category[] = await categoriesRes.json();
      const sectionsRaw: any[] = await sectionsRes.json();
      const itemsRaw: any[] = await itemsRes.json();

      const contentMap: Record<string, CategoryData> = {};
      categories.forEach(cat => { contentMap[cat.id] = { id: cat.id, sections: [] }; });

      const itemsBySection: Record<string, ContentItem[]> = {};
      itemsRaw.forEach(item => {
        const sectionId = item.section_id;
        if (!itemsBySection[sectionId]) itemsBySection[sectionId] = [];
        const normalizedItem = {
          ...item,
          tags: item.tags || [],
          imageUrl: item.image_url,
          modelUrl: item.model_url,
          githubUrl: item.github_url,
          youtubeUrl: item.youtube_url,
          externalUrl: item.external_url
        };
        if (normalizedItem.is_completed !== undefined) normalizedItem.isCompleted = normalizedItem.is_completed;
        itemsBySection[sectionId].push(normalizedItem);
      });

      // Sort items within each section by order_index
      Object.keys(itemsBySection).forEach(sectionId => {
        itemsBySection[sectionId].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
      });

      sectionsRaw.forEach(sec => {
        const catId = sec.category_id;
        if (contentMap[catId]) {
          contentMap[catId].sections.push({
            id: sec.id,
            title: sec.title,
            items: itemsBySection[sec.id] || []
          });
        }
      });

      return { categories, content: contentMap };
    } catch (error) {
      console.error("API Error:", error);
      return { categories: [], content: {} };
    }
  },

  // Sections
  createSection: async (section: { category_id: string; title: string; order_index: number }) => {
    const res = await fetch(`${API_BASE_URL}/api/sections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(section)
    });
    return res.json();
  },
  updateSection: async (id: string, title: string) => {
    const res = await fetch(`${API_BASE_URL}/api/sections/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    return res.json();
  },
  deleteSection: async (id: string) => {
    await fetch(`${API_BASE_URL}/api/sections/${id}`, { method: 'DELETE' });
  },

  // Items
  createItem: async (item: any) => {
    const res = await fetch(`${API_BASE_URL}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return res.json();
  },
  updateItem: async (id: string, item: any) => {
    const res = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return res.json();
  },
  deleteItem: async (id: string) => {
    await fetch(`${API_BASE_URL}/api/items/${id}`, { method: 'DELETE' });
  },
  toggleTodo: async (id: string, isCompleted: boolean) => {
    await fetch(`${API_BASE_URL}/api/todo/${id}/toggle`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted })
    });
  }
};