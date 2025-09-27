// /dashboard/Sidebar.tsx
'use client';
import { useState } from 'react';
import { HomeIcon, MusicalNoteIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const navItems = [
  { label: 'Categories', icon: MusicalNoteIcon, href: '/dashboard/categories' },
  { label: 'New Releases', icon: RectangleStackIcon, href: '/dashboard/new-releases' },
  { label: 'Playlists', icon: HomeIcon, href: '/dashboard/playlists' },
];

export default function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-gray-900 text-white z-50
                  w-16 ${isHovered ? 'w-52' : 'w-16'} 
                  transition-all duration-300 ease-in-out shadow-lg`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col mt-8 space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} href={item.href} className="group relative flex items-center">
              <Icon className="h-8 w-8 mx-auto text-gray-300 group-hover:text-teal-400" />
              <span
                className={`absolute left-16 whitespace-nowrap ml-4 
                            opacity-0 ${isHovered ? 'opacity-100' : 'opacity-0'}
                            transition-opacity duration-300`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
