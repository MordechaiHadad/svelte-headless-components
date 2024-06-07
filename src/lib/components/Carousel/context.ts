import type { Direction } from "$lib/types.js";

interface context {
    currentSlide: number;
    direction: Direction;
    length: number;
    carousel?: HTMLElement;
    currentItem?: HTMLElement;
}

export type { context };