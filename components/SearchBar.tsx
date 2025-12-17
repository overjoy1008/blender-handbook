import React from 'react';
import { Icon } from './Icon';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
        <Icon name="Search" size={18} />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-xl leading-5 bg-white dark:bg-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blender-orange focus:border-blender-orange sm:text-sm transition-all shadow-sm"
        placeholder="Search shortcuts, nodes, tips..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          <Icon name="X" size={16} />
        </button>
      )}
    </div>
  );
};