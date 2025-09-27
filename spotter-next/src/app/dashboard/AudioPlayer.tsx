'use client';

import { useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline';
import { appDispatch, appSelector } from '@/hooks/storeHooks';
import {
  play,
  pause,
  setTime,
  setDuration,
} from "@/store/playerSlice";

export default function AudioPlayer() {
  const dispatch = appDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isPlaying, currentTime, currentTrack, duration } = appSelector(state => state.player);
  
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      dispatch(pause());
    } else {
      audioRef.current.play();
      dispatch(play());
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const value = Number(e.target.value);
    audioRef.current.currentTime = value;
    dispatch(setTime(value));
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleUpdateTime = () => dispatch(setTime(audio.currentTime));
    const handleMetaData = () => dispatch(setDuration(audio.duration));

    audio.addEventListener("timeupdate", handleUpdateTime);
    audio.addEventListener("loadedmetadata", handleMetaData);

    return () => {
      audio.removeEventListener("timeupdate", handleUpdateTime);
      audio.removeEventListener("loadedmetadata", handleMetaData);
    };
  }, [dispatch]);

  return (
    <div className="fixed bottom-0 left-1/2 z-[999] w-[400px] max-w-[calc(100%-70px)] -translate-x-1/2 rounded-t-md bg-neutral-700 shadow-lg">
      <audio ref={audioRef} src={currentTrack?.src} preload="metadata" />

      {currentTrack?.title && (
        <p className="song-title mt-3 text-center text-xs leading-3 text-white">
          <span className="text-pink-500">{currentTrack?.title}</span>
        </p>
      )}

      <div className="player-controls absolute bottom-0 left-0 flex w-full items-center gap-3 px-6 pb-2">
        <button
          onClick={togglePlay}
          className="icon relative top-[-5px] left-2 cursor-pointer text-white hover:text-sky-400"
        >
          {isPlaying ? (
            <PauseIcon className="h-8 w-8" />
          ) : (
            <PlayIcon className="h-8 w-8" />
          )}
        </button>

        <div className="range-container relative flex-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full cursor-pointer accent-sky-400"
          />
        </div>

        <span className="time text-xs text-white">
          {Math.floor(currentTime / 60)}:
          {String(Math.floor(currentTime % 60)).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
