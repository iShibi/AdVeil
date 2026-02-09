import type { AdPlaybackStatus } from './ServiceWorker';

console.log("[Content] Loaded 'AdVeil' browser extension content script.");

export interface LocalStorage {
	blurValue: number | undefined;
	fadeValue: number | undefined;
}

async function init() {
	const { blurValue, fadeValue } = await chrome.storage.local.get<LocalStorage>(['blurValue', 'fadeValue']);
	document.documentElement.style.setProperty('--blur-value', `${blurValue ?? 0}px`);
	document.documentElement.style.setProperty('--opacity-value', `${100 - (fadeValue ?? 0)}%`);
}
init();

async function toggleAdBlurring(message: AdPlaybackStatus) {
	const videoElement = document.getElementById('video-container')!;
	if (message.adPlaying) {
		videoElement.style = `filter: blur(var(--blur-value)) opacity(var(--opacity-value))`;
	} else {
		videoElement.style = 'filter: blur(0px) opacity(100%)';
	}
}

chrome.runtime.onMessage.addListener(toggleAdBlurring);

async function updateFilterValues(changes: { [key: string]: chrome.storage.StorageChange }) {
	if (Object.hasOwn(changes, 'blurValue')) {
		const blurValue = changes['blurValue'].newValue as LocalStorage['blurValue'];
		document.documentElement.style.setProperty('--blur-value', `${blurValue ?? 0}px`);
	}
	if (Object.hasOwn(changes, 'fadeValue')) {
		const fadeValue = changes['fadeValue'].newValue as LocalStorage['fadeValue'];
		document.documentElement.style.setProperty('--opacity-value', `${100 - (fadeValue ?? 0)}%`);
	}
}

chrome.storage.local.onChanged.addListener(changes => {
	updateFilterValues(changes);
});
