import React from 'react';
import { 
  Keyboard, 
  Settings, 
  Lightbulb, 
  Grid, 
  Share2, 
  Search, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  ChevronRight,
  Copy,
  Check,
  FlaskConical,
  Box,
  Github,
  Plug,
  ListTodo,
  Youtube,
  ExternalLink,
  CheckSquare,
  Square
} from 'lucide-react';

export const Icons = {
  Keyboard,
  Settings,
  Lightbulb,
  Grid,
  Share2,
  Search,
  Menu,
  X,
  Moon,
  Sun,
  ChevronRight,
  Copy,
  Check,
  FlaskConical,
  Box,
  Github,
  Plug,
  ListTodo,
  Youtube,
  ExternalLink,
  CheckSquare,
  Square
};

export type IconName = keyof typeof Icons;

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, className, size = 20 }) => {
  const LucideIcon = Icons[name as IconName];
  if (!LucideIcon) return null;
  return <LucideIcon className={className} size={size} />;
};