import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/");
        }
    }, [status, router]);

    if (status === "loading") return <p>Loading...</p>; // need loader component

    return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="mb-6">Welcome, {session?.user?.name || "Spotify User"}!</p>
      <button
        onClick={() => signOut()}
        className="px-4 py-2 rounded-full border border-[#10E0A5] text-[#10E0A5] hover:bg-[#10E0A5] hover:text-[#333] transition-all"
      >
        Sign Out
      </button>
    </div>
  );
}