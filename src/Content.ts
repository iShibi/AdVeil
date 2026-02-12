export interface LocalStorage {
	blurValue: number | undefined;
	fadeValue: number | undefined;
	isPaused: boolean | undefined;
	isAdPlaying: boolean | undefined;
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}

async function init() {
	console.log("[Content] Loaded 'AdVeil' browser extension content script.");
	const { blurValue, fadeValue } = await chrome.storage.local.get<LocalStorage>(['blurValue', 'fadeValue']);
	document.documentElement.style.setProperty('--blur-value', `${blurValue ?? 0}px`);
	document.documentElement.style.setProperty('--opacity-value', `${100 - (fadeValue ?? 0)}%`);
}

const observerForAcceptedSubmmission = new MutationObserver((_, thisObserver) => {
	const videoContainer = document.getElementById('video-container');
	if (videoContainer) {
		videoContainer.classList.add('__ad_filter_transition');
		thisObserver.disconnect();
	}
});

observerForAcceptedSubmmission.observe(document.body, {
	childList: true,
	subtree: true,
});

chrome.storage.local.onChanged.addListener(async changes => {
	if (Object.hasOwn(changes, 'isPaused')) {
		const isPaused = changes['isPaused'].newValue as LocalStorage['isPaused'];
		const videoContainer = document.getElementById('video-container')!;
		if (isPaused) {
			videoContainer.classList.remove('__ad_filter');
		} else {
			const { isAdPlaying } = await chrome.storage.local.get<LocalStorage>(['isAdPlaying']);
			if (isAdPlaying) {
				videoContainer.classList.add('__ad_filter');
			}
		}
	}

	if (Object.hasOwn(changes, 'blurValue')) {
		const blurValue = changes['blurValue'].newValue as LocalStorage['blurValue'];
		document.documentElement.style.setProperty('--blur-value', `${blurValue ?? 0}px`);
	}

	if (Object.hasOwn(changes, 'fadeValue')) {
		const fadeValue = changes['fadeValue'].newValue as LocalStorage['fadeValue'];
		document.documentElement.style.setProperty('--opacity-value', `${100 - (fadeValue ?? 0)}%`);
	}

	if (Object.hasOwn(changes, 'isAdPlaying')) {
		const isAdPlaying = changes['isAdPlaying'].newValue as LocalStorage['isAdPlaying'];
		toggleAdBlurring(isAdPlaying ?? false);
	}
});

async function toggleAdBlurring(isAdPlaying: boolean) {
	const videoContainer = document.getElementById('video-container')!;
	const { isPaused } = await chrome.storage.local.get<LocalStorage>(['isPaused']);
	if (!isPaused && isAdPlaying) {
		videoContainer.classList.add('__ad_filter');
	} else {
		videoContainer.classList.remove('__ad_filter');
	}
}
