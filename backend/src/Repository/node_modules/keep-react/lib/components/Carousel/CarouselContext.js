'use client';
import { createContext, useContext } from 'react';
export const CarouselContext = createContext(undefined);
export function useCarouselContext() {
    const context = useContext(CarouselContext);
    if (!context) {
        throw new Error('useCarouselContext should be used within the CarouselContext provider!');
    }
    return context;
}
