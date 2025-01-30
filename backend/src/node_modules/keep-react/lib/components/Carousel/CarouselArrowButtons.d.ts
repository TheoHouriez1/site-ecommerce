import { EmblaCarouselType } from 'embla-carousel';
import { ButtonHTMLAttributes } from 'react';
type UsePrevNextButtonsType = {
    prevBtnDisabled: boolean;
    nextBtnDisabled: boolean;
    onPrevButtonClick: () => void;
    onNextButtonClick: () => void;
};
export declare const usePrevNextButtons: (emblaApi: EmblaCarouselType | undefined) => UsePrevNextButtonsType;
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}
declare const CarouselPrevButton: import("react").ForwardRefExoticComponent<ButtonProps & import("react").RefAttributes<HTMLButtonElement>>;
declare const CarouselNextButton: import("react").ForwardRefExoticComponent<ButtonProps & import("react").RefAttributes<HTMLButtonElement>>;
export { CarouselNextButton, CarouselPrevButton };
