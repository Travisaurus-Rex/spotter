import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Track {
    src: string;
    title?: string
    artist?: string;
}

interface PlayerState {
    currentTrack: Track | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
}

const initialState: PlayerState = {
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0
}

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setTrack: (state, action: PayloadAction<Track>) => {
            state.currentTrack = action.payload;
            state.currentTime = 0;
            state.isPlaying = true;
        },
        play: (state) => {
            state.isPlaying = true;
        },
        pause: (state) => {
            state.isPlaying = false;
        }, 
        setTime: (state, action: PayloadAction<number>) => {
            state.currentTime = action.payload;
        },
        setDuration: (state, action: PayloadAction<number>) => {
            state.duration = action.payload;
        },
    }
})

export const { setTrack, play, pause, setTime, setDuration } = playerSlice.actions;
export default playerSlice.reducer; 