<script lang="ts">
	import { createEventDispatcher, setContext } from 'svelte';
	import type { IContext } from './context.js';
	import { twMerge } from 'tailwind-merge';
	import { autoplay, scroll } from './functions.js';
	import { detectSwipingDirection, swipe } from './swiping.js';
	import type { Direction } from './types.js';

	const dispatch = createEventDispatcher();

	export let direction: Direction = 'column';
	export let autoplayEnabled = false;
	export let autoplayInterval = 5000;
	export let currentSlide = 0;

	let context: IContext = $state({
		direction,
		currentSlide: 0,
		length: 0
	});

	setContext('carousel', context);

	currentSlide = $derived(context.currentSlide);

	const updateContext = (node: HTMLElement) => context.carousel = node;

	const handleSwipe = (event: CustomEvent) => {
		const swipeDirection = detectSwipingDirection(
			event.detail.startX,
			event.detail.startY,
			event.detail.endX,
			event.detail.endY
		);

		if (
			swipeDirection === 'none' ||
			(context.direction === 'column' &&
				(swipeDirection === 'left' || swipeDirection === 'right')) ||
			(context.direction === 'row' && (swipeDirection === 'up' || swipeDirection === 'down'))
		)
			return;

		let dir: 'prev' | 'next' = 'prev';

		if (swipeDirection === 'right') dir = 'prev';
		else if (swipeDirection === 'left') dir = 'next';
		else if (swipeDirection === 'up') dir = 'next';
		else if (swipeDirection === 'down') dir = 'prev';

		scroll(dir, context);
	};

	const handleAutoplay = () => {
		scroll('next', context);
	};
</script>

<div
	class={twMerge('relative select-none', $$props.class)}
	use:autoplay={{ enabled: autoplayEnabled, interval: autoplayInterval }}
	on:autoplay={handleAutoplay}
	use:updateContext
	use:swipe
	on:swipe={handleSwipe}
	on:wheel={(event) => {
		dispatch('scroll', {
			event,
			context
		});
	}}
>
	<slot />
</div>
