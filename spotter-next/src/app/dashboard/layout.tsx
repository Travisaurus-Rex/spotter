import Sidebar from './Sidebar';
//import AudioPlayer from './AudioPlayer';

export const metadata = {
  title: 'Spotter Dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <Sidebar />

      <main className="ml-16 hover:ml-52 transition-all duration-300 p-6">
        {children}
      </main>

      <div className="fixed bottom-0 left-0 w-full">
        { /* AudioPlayer goes here */ }
      </div>
    </div>
  );
}
