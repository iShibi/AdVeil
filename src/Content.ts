console.log("[Content] Loaded 'AdVeil' browser extension content script.");

interface AdPlaybackStatus {
	adPlaying: boolean;
}

function toggleAdBlurring(message: AdPlaybackStatus) {
	// const shouldBlur = document.location.href.includes('live');

	if (message.adPlaying) {
		const videoElement = document.getElementById('video-container')!;
		console.log(videoElement);
		videoElement.style = 'filter: blur(100px)';
	} else {
		const videoElement = document.getElementById('video-container')!;
		console.log(videoElement);
		videoElement.style = 'filter: blur(0px)';
	}
}

chrome.runtime.onMessage.addListener(toggleAdBlurring);
