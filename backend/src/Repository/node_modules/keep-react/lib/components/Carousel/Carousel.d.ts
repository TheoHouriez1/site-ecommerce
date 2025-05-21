import { EmblaOptionsType, EmblaPluginType } from 'embla-carousel';
import { HTMLAttributes } from 'react';
interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
    options?: EmblaOptionsType;
    plugins?: EmblaPluginType[];
    carouselViewportClasses?: string;
}
declare const Carousel: import("react").ForwardRefExoticComponent<CarouselProps & import("react").RefAttributes<HTMLDivElement>>;
export { Carousel };
