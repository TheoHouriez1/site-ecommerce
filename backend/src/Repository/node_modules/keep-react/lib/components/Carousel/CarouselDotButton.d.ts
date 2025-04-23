import { EmblaCarouselType } from 'embla-carousel';
import { ButtonHTMLAttributes } from 'react';
type UseDotButtonType = {
    selectedIndex: number;
    scrollSnaps: number[];
    onDotButtonClick: (index: number) => void;
};
export declare const useDotButton: (emblaApi: EmblaCarouselType | undefined) => UseDotButtonType;
export interface DotButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}
export declare const DotButton: import("react").ForwardRefExoticComponent<DotButtonProps & import("react").RefAttributes<HTMLButtonElement>>;
export {};
