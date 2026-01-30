console.log("[Content] Loaded 'AdVeil' browser extension content script.");

interface AdPlaybackStatus {
	adPlaying: boolean;
}

async function toggleAdBlurring(message: AdPlaybackStatus) {
	// const shouldBlur = document.location.href.includes('live');

	if (message.adPlaying) {
		const videoElement = document.getElementById('video-container')!;
		const { blurValue, fadeValue } = await chrome.storage.local.get<{ [key: string]: number }>([
			'blurValue',
			'fadeValue',
		]);
		videoElement.style = `filter: blur(${blurValue}px) opacity(${100 - fadeValue}%)`;
	} else {
		const videoElement = document.getElementById('video-container')!;
		videoElement.style = 'filter: blur(0px) opacity(100%)';
	}
}

chrome.runtime.onMessage.addListener(toggleAdBlurring);

// For testing the blur and fade sliders:
// async function test() {
// 	const videoElement = document.getElementById('video-container')!;
// 	const { blurValue, fadeValue } = await chrome.storage.local.get<{ [key: string]: number }>([
// 		'blurValue',
// 		'fadeValue',
// 	]);
// 	videoElement.style = `filter: blur(${blurValue}px) opacity(${100 - fadeValue}%)`;
// 	// videoElement.style = ``;
// }

// chrome.storage.local.onChanged.addListener(() => {
// 	test();
// });
