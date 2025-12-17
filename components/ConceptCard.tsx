import React from 'react';
import { ConceptItem, NodeItem, ContentItem } from '../types';
import { ModelViewer } from './ModelViewer';
import { Icon } from './Icon';

interface ConceptCardProps {
  item: ConceptItem | NodeItem;
  isAdmin?: boolean;
  onEdit?: (item: ContentItem) => void;
  onDelete?: (id: string) => void;
}

export const ConceptCard: React.FC<ConceptCardProps> = ({ item, isAdmin, onEdit, onDelete }) => {
  const isNode = item.type === 'node';
  const isConcept = item.type === 'concept';
  
  const hasGithub = 'githubUrl' in item && item.githubUrl;
  const hasExternal = 'externalUrl' in item && item.externalUrl;
  const hasModel = 'modelUrl' in item && item.modelUrl;
  const hasLink = hasGithub || hasExternal;

  return (
    <div className="glass-card flex flex-col h-full rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-blender-orange/30 transition-all duration-300 group relative">
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

      {isConcept && (
        <>
          {hasModel ? (
            <ModelViewer modelUrl={item.modelUrl!} />
          ) : item.imageUrl ? (
            <div className="h-40 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          ) : null}
        </>
      )}
      
      <div className="p-5 flex-1 flex flex-col relative">
        <div className="mb-3">
            {isNode && (
               <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blender-blue/10 text-blender-blue dark:text-blue-400 mb-2 border border-blender-blue/20">
                 {item.category}
               </span>
            )}
            <div className="flex justify-between items-start">
              {hasLink ? (
                 <a 
                   href={hasExternal ? item.externalUrl : item.githubUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-lg font-bold text-zinc-900 dark:text-zinc-100 hover:text-blender-orange transition-colors duration-200 pr-12"
                 >
                   {item.title}
                 </a>
              ) : (
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 pr-12">
                  {item.title}
                </h3>
              )}
              
              <div className="flex gap-2">
                {hasExternal && (
                  <a href={item.externalUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-blender-orange transition-colors" title="Visit Link">
                    <Icon name="ExternalLink" size={18} />
                  </a>
                )}
                {hasGithub && (
                  <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-blender-orange transition-colors" title="View on GitHub">
                    <Icon name="Github" size={18} />
                  </a>
                )}
              </div>
            </div>
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-300/80 mb-4 leading-relaxed flex-grow font-medium">
          {item.description}
        </p>

        {isConcept && item.details && item.details.length > 0 && (
          <ul className="text-sm space-y-1.5 text-zinc-500 dark:text-zinc-400 list-disc list-inside bg-white/40 dark:bg-zinc-950/30 p-3 rounded-lg border border-white/10 dark:border-zinc-800/50">
            {item.details.map((detail, idx) => (
              <li key={idx} className="leading-snug">{detail}</li>
            ))}
          </ul>
        )}

        {isNode && (
          <div className="flex gap-4 mt-2 text-xs font-mono">
             <div className="flex-1">
                <span className="block text-zinc-400 mb-1 uppercase tracking-wider text-[10px]">Inputs</span>
                <div className="flex flex-col gap-1">
                    {item.inputs && item.inputs.length > 0 ? item.inputs.map((i, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600"></div>
                             <span className="text-zinc-700 dark:text-zinc-300">{i}</span>
                        </div>
                    )) : <span className="text-zinc-500 italic">None</span>}
                </div>
             </div>
             <div className="flex-1 text-right">
                <span className="block text-zinc-400 mb-1 uppercase tracking-wider text-[10px]">Outputs</span>
                <div className="flex flex-col gap-1 items-end">
                    {item.outputs && item.outputs.length > 0 ? item.outputs.map((o, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 flex-row-reverse">
                             <div className="w-1.5 h-1.5 rounded-full bg-blender-orange"></div>
                             <span className="text-zinc-700 dark:text-zinc-300">{o}</span>
                        </div>
                    )) : <span className="text-zinc-500 italic">None</span>}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};