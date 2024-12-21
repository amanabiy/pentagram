'use client';

import { configureStore } from '@reduxjs/toolkit';
import imageReducer from './imageSlice';

// Define the RootState type
export type RootState = {
  imageList: {
    images: {
      url: string;
      description: string;
    }[];
  };
};

const store = configureStore({
  reducer: {
    imageList: imageReducer, // Ensure the key matches your slice
  },
});

export default store;
