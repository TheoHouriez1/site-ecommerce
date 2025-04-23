import { EmblaCarouselType } from 'embla-carousel';
type EmblaViewportRefType = <ViewportElement extends HTMLElement>(instance: ViewportElement | null) => void;
type CarouselContextPropTypes = {
    emblaApi: EmblaCarouselType | undefined;
    emblaRef: EmblaViewportRefType;
};
export declare const CarouselContext: import("react").Context<CarouselContextPropTypes | undefined>;
export declare function useCarouselContext(): CarouselContextPropTypes;
export {};
