'use client';

import React from 'react';
import { 
  Globe, Sun, Building2, Home, Trees, Waves, 
  Crown, Palmtree, Mountain 
} from 'lucide-react';

interface Category {
  id: string;
  label: string;
  icon: React.ElementType;
}

const categories: Category[] = [
  { id: '', label: 'All Stays', icon: Globe },
  { id: 'Beachfront', label: 'Beachfront', icon: Sun },
  { id: 'Villa', label: 'Villas', icon: Home },
  { id: 'Apartment', label: 'Iconic Cities', icon: Building2 },
  { id: 'Cabin', label: 'Cabins', icon: Trees },
  { id: 'Pool', label: 'Amazing Pools', icon: Waves },
  { id: 'Mansion', label: 'Mansions', icon: Crown },
  { id: 'Treehouse', label: 'Treehouses', icon: Palmtree },
  { id: 'Countryside', label: 'Countryside', icon: Mountain },
];

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-[80px] z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8 overflow-x-auto py-4 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id || 'all'}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center min-w-[64px] space-y-2 group transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'text-rose-500 border-b-2 border-rose-500 pb-1 font-semibold'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 border-b-2 border-transparent pb-1'
                }`}
              >
                <Icon className={`w-6 h-6 transition-transform group-hover:scale-110 ${isSelected ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
                <span className="text-xs whitespace-nowrap">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
