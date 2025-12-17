import React, { useState } from 'react';
import { ShortcutItem } from '../types';
import { Icon } from './Icon';

interface ShortcutCardProps {
  item: ShortcutItem;
  isAdmin?: boolean;
  onEdit?: (item: ShortcutItem) => void;
  onDelete?: (id: string) => void;
}

export const ShortcutCard: React.FC<ShortcutCardProps> = ({ item, isAdmin, onEdit, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `${item.title}: ${item.keys.join(' + ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card group relative rounded-xl p-5 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-md hover:border-blender-orange/30 transition-all duration-300">
      {isAdmin && (
        <div className="absolute top-2 right-12 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
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
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blender-orange mb-1.5 block">
            {item.context}
          </span>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{item.title}</h3>
        </div>
        <button
          onClick={handleCopy}
          className="text-zinc-400 hover:text-blender-orange transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
          title="Copy shortcut"
        >
          <Icon name={copied ? 'Check' : 'Copy'} size={16} />
        </button>
      </div>
      
      <p className="text-sm text-zinc-600 dark:text-zinc-300/80 mb-5 leading-relaxed">
        {item.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {item.keys.map((key, idx) => (
          <React.Fragment key={idx}>
            <kbd className="inline-flex items-center justify-center min-w-[32px] px-2.5 py-1.5 bg-white dark:bg-zinc-800 border-b-2 border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-mono font-semibold text-zinc-700 dark:text-zinc-200 shadow-sm">
              {key}
            </kbd>
            {idx < item.keys.length - 1 && (
              <span className="self-center text-zinc-300 dark:text-zinc-600 text-xs font-bold">+</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};