console.log('[ServiceWorker] Loaded "AdVeil" browser extension ServiceWorker script.');

let latestAdName = '';
const muteDurationEndBuffer = 150;
const cricketTabUrl = '*://*.hotstar.com/in/sports/cricket/*';
const adNameRegex = /(?:_|^)(\d{2})(?:s)?(?=$|_)/;

interface AdPlaybackStatus {
	adPlaying: boolean;
}

// Listen for outgoing requests
chrome.webRequest.onBeforeRequest.addListener(
	// @ts-expect-error TS warns not to use async function but it works during runtime
	async function (details) {
		if (details.method === 'GET' && details.url.includes('bifrost-api.hotstar.com')) {
			const searchParams = new URL(details.url).searchParams;
			const adName = searchParams.get('adName');
			if (adName) {
				latestAdName = adName;
				console.log(adName);
				const duration = adName.match(adNameRegex)?.[1];
				if (!duration) return console.log('Unable to parse ad duration.');
				const cricketTab = (await chrome.tabs.query({ url: cricketTabUrl }))[0];
				if (!cricketTab.mutedInfo?.muted) {
					chrome.tabs.update(cricketTab.id, { muted: true });
					chrome.tabs.sendMessage<AdPlaybackStatus>(cricketTab.id!, { adPlaying: true });
				}
				setTimeout(
					() => {
						// Skip unmuting and unbluring if another ad has started.
						if (adName === latestAdName) {
							chrome.tabs.update(cricketTab.id, { muted: false });
							chrome.tabs.sendMessage<AdPlaybackStatus>(cricketTab.id!, { adPlaying: false });
						}
					},
					parseInt(duration) * 1000 + muteDurationEndBuffer,
				);
			}
		}
		return {}; // Allow the request to proceed as normal
	},
	{ urls: ['*://*.hotstar.com/*'] },
);
