import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';

export const appDispatch = useDispatch.withTypes<AppDispatch>();
export const appSelector = useSelector.withTypes<RootState>();