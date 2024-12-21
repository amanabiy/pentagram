'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ImageItem {
    url: string;
    description: string;
}

interface ImageState {
    images: ImageItem[];
}

const initialState: ImageState = {
    images: [
        // {
        //     url: 'https://placehold.co/600x400',
        //     description: 'Sample Image 1',
        // },
        {
            url: 'https://placehold.co/600x400',
            description: 'Sample Image 2',
        },
        // {
        //     url: 'https://placehold.co/600x400',
        //     description: 'Sample Image 1',
        // },
        // {
        //     url: 'https://placehold.co/600x400',
        //     description: 'Sample Image 2',
        // },
        // {
        //     url: 'https://placehold.co/600x400',
        //     description: 'Sample Image 1',
        // },
        // {
        //     url: 'https://placehold.co/600x400',
        //     description: 'Sample Image 2',
        // },
        // {
        //     url: 'https://placehold.co/600x400',
        //     description: 'Sample Image 1',
        // },
        // {
        //     url: 'https://placehold.co/600x400',
        //     description: 'Sample Image 2',
        // },
        // {
        //     url: 'https://placehold.co/600x400',
        //     description: 'Sample Image 1',
        // },
        // {
        //     url: 'https://placehold.co/600x400',
        //     description: 'Sample Image 2',
        // },
        // Add more sample images
    ],
};

const imageSlice = createSlice({
    name: 'imageList',
    initialState,
    reducers: {
        setImages: (state, action: PayloadAction<ImageItem[]>) => {
            state.images = action.payload;
        },
        addImage: (state, action: PayloadAction<ImageItem>) => {
            state.images.push(action.payload);
        },
    },
});

export const { setImages, addImage } = imageSlice.actions;

export default imageSlice.reducer;
