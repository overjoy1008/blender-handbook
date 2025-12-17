import React from 'react';
import { TodoItem } from '../types';
import { Icon } from './Icon';

interface TodoCardProps {
  item: TodoItem;
  isAdmin?: boolean;
  onToggle?: (id: string, newState: boolean) => void;
  onEdit?: (item: TodoItem) => void;
  onDelete?: (id: string) => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({ item, isAdmin, onToggle, onEdit, onDelete }) => {
  const handleToggle = () => {
    if (onToggle) onToggle(item.id, !item.isCompleted);
  };

  return (
    <div className={`glass-card group flex items-start gap-4 p-5 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md relative ${item.isCompleted ? 'border-green-500/30 bg-green-50/20 dark:bg-green-900/10' : 'border-zinc-200/50 dark:border-zinc-800/50'}`}>
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button 
            onClick={() => onEdit?.(item)}
            className="p-1.5 rounded-md bg-white/80 dark:bg-zinc-800/80 text-zinc-500 hover:text-blender-orange shadow-sm"
          >
            <Icon name="Settings" size={14} />
          </button>
          <button 
            onClick={() => onDelete?.(item.id)}
            className="p-1.5 rounded-md bg-white/80 dark:bg-zinc-800/80 text-zinc-500 hover:text-red-500 shadow-sm"
          >
            <Icon name="X" size={14} />
          </button>
        </div>
      )}

      <button onClick={handleToggle} className={`mt-1 flex-shrink-0 transition-colors hover:scale-110 active:scale-95 transform duration-150 ${item.isCompleted ? 'text-green-600 dark:text-green-500' : 'text-zinc-300 dark:text-zinc-600 hover:text-blender-orange'}`}>
        <Icon name={item.isCompleted ? 'CheckSquare' : 'Square'} size={24} />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className={`font-bold text-lg mb-1 leading-snug pr-12 ${item.isCompleted ? 'text-zinc-500 dark:text-zinc-500 line-through decoration-2 decoration-zinc-300 dark:decoration-zinc-700' : 'text-zinc-900 dark:text-zinc-100'}`}>
            {item.title}
          </h3>
          {item.youtubeUrl && (
            <a href={item.youtubeUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-red-500 hover:text-red-600 opacity-80 hover:opacity-100 transition-opacity" title="Watch Tutorial">
              <Icon name="Youtube" size={20} />
            </a>
          )}
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.description}</p>
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {item.tags.map((tag, idx) => (
              <span key={idx} className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-100/50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};