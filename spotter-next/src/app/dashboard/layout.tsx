"use client";

import Sidebar from './Sidebar';
import AudioPlayer from './AudioPlayer';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';

export const metadata = {
  title: 'Spotter Dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentTrack } = useSelector((state: RootState) => state.player);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <Sidebar />

      <main className="ml-16 hover:ml-52 transition-all duration-300 p-6">
        {children}
      </main>

      <div className="fixed bottom-0 left-0 w-full">
        { currentTrack?.src && <AudioPlayer /> }
      </div>
    </div>
  );
}
