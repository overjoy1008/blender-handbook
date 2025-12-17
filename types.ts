export type CategoryId = 'shortcuts' | 'settings' | 'lights' | 'topology' | 'nodes' | 'experiments' | 'components' | 'addons' | 'todo';

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  description: string;
}

export type ContentType = 'shortcut' | 'concept' | 'node' | 'todo';

export interface BaseItem {
  id: string;
  section_id?: string;
  title: string;
  description: string;
  tags: string[];
  order_index?: number;
  githubUrl?: string;
  externalUrl?: string;
}

export interface ShortcutItem extends BaseItem {
  type: 'shortcut';
  keys: string[];
  context: 'Object Mode' | 'Edit Mode' | 'Sculpt' | 'General' | 'Node Editor';
}

export interface ConceptItem extends BaseItem {
  type: 'concept';
  imageUrl?: string;
  modelUrl?: string;
  details?: string[];
}

export interface NodeItem extends BaseItem {
  type: 'node';
  inputs: string[];
  outputs: string[];
  category: 'Shader' | 'Geometry' | 'Texture';
}

export interface TodoItem extends BaseItem {
  type: 'todo';
  isCompleted: boolean;
  youtubeUrl?: string;
}

export type ContentItem = ShortcutItem | ConceptItem | NodeItem | TodoItem;

export interface Section {
  id: string;
  title: string;
  items: ContentItem[];
}

export interface CategoryData {
  id: CategoryId;
  sections: Section[];
}