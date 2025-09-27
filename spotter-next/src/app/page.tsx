"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") return null; // need a loader

  return (
    <div
      className="relative w-full h-screen bg-cover bg-left-bottom"
      style={{ backgroundImage: "url('/img/headphones.jpeg')" }}
    >
      <div className="absolute inset-0 bg-[#0f0f23]/90"></div>

      <div className="relative max-w-3xl mx-auto top-1/2 -translate-y-1/2 z-10 text-center">
        <div className="border-b-8 border-[#10E0A5] inline-block pb-3">
          <h1 className="text-[#10E0A5] font-extrabold text-[130px] font-sans m-0 p-0 leading-none">
            Spotter
          </h1>
          <h3 className="text-white text-[36px] font-light font-quicksand m-0 pb-3">
            is a simple user interface for discovering new music with the Spotify API.
          </h3>
        </div>

        <p className="text-white text-[18px] font-normal font-quicksand my-3">
          This application requires a Spotify account.
        </p>
        <div className="h-15">
          <button
            onClick={() => signIn("spotify")}
            className="block mx-auto mt-3 px-4 py-2 rounded-full border border-[#10E0A5] text-[#10E0A5] font-quicksand text-lg font-normal transition-all duration-100 hover:bg-[#10E0A5] hover:text-[#333]"
          >
            Login with Spotify
          </button>
        </div>
      </div>
    </div>
  );
}