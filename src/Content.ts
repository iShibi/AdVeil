console.log("[Content] Loaded 'AdVeil' browser extension content script.");

export interface LocalStorage {
	blurValue: number | undefined;
	fadeValue: number | undefined;
	isPaused: boolean | undefined;
	isAdPlaying: boolean | undefined;
}

async function init() {
	const { blurValue, fadeValue } = await chrome.storage.local.get<LocalStorage>(['blurValue', 'fadeValue']);
	document.documentElement.style.setProperty('--blur-value', `${blurValue ?? 0}px`);
	document.documentElement.style.setProperty('--opacity-value', `${100 - (fadeValue ?? 0)}%`);
}
init();

chrome.storage.local.onChanged.addListener(async changes => {
	if (Object.hasOwn(changes, 'isPaused')) {
		const isPaused = changes['isPaused'].newValue as LocalStorage['isPaused'];
		const videoElement = document.getElementById('video-container')!;
		if (isPaused) {
			videoElement.style = 'filter: blur(0px) opacity(100%)';
		} else {
			const { isAdPlaying } = await chrome.storage.local.get<LocalStorage>(['isAdPlaying']);
			if (isAdPlaying) {
				videoElement.style = `filter: blur(var(--blur-value)) opacity(var(--opacity-value))`;
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
	const videoElement = document.getElementById('video-container')!;
	const { isPaused } = await chrome.storage.local.get<LocalStorage>(['isPaused']);
	if (!isPaused && isAdPlaying) {
		videoElement.style = `filter: blur(var(--blur-value)) opacity(var(--opacity-value))`;
	} else {
		videoElement.style = 'filter: blur(0px) opacity(100%)';
	}
}
